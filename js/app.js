var houses = [];
var markers = [];

var AddressInput = {

    settings: {
        addressList: $('.address-input')
    },

    init: function () {
        this.settings.addressList.autocomplete({
            //appendTo: ".dropdown-toggle",
            minLength: 5,
            source: this.addressSource,
            select: this.addressSelect
        });
    },

    addHouse: function () {
        var lineNum = this.settings.addressList.length + 1;
        var inputLabel = 'addressInput' + lineNum;
        $('#addressForm').append('<div class="form-group"><input id="' + inputLabel + '" type="text" class="address-input form-control"></div>'
        );
        this.settings.addressList = $('.address-input');
        this.init();
    },

    addressSelect: function (event, ui) {
        var coords = ui.item.coords;

        $(this).attr('data', coords);
        var marker = L.marker(coords).bindPopup(ui.item.label);
        markerGroup.addLayer(marker);
        if (map.hasLayer(markerGroup) === false) {
            console.log('butt');
            markerGroup.addTo(map);
        }
        map.fitBounds(markerGroup.getBounds());
    },

    addressSource: function (requestString, responseFunc) {
        var queryString = requestString.term.replace(/[^0-9a-zA-Z ]/g, '');

        $.ajax({
            url: 'https://search.mapzen.com/v1/autocomplete',
            dataType: 'json',
            data: {
                'text': queryString,
                'api_key': 'search-WE7i6v8',
                'focus.point.lat': '37.338',
                'focus.point.lon': '-121.886',
            },
            success: function (data) {
                var arr = [];
                data.features.forEach(function(feature) {
                    arr.push({
                        label: feature.properties.label,
                        value: feature.properties.label,
                        coords: feature.geometry.coordinates.reverse()
                    });
                });

                responseFunc(arr);
            },
            error: function (jqXHR, status, error) {
                console.log(error);
            }
        });
    },

    //getAddress: function (e) {
    //    if (e.keyCode == 13) {
    //        var searchTerm = e.srcElement.value;
    //        $.ajax({
    //            url: 'https://search.mapzen.com/v1/search',
    //            dataType: 'json',
    //            data: {
    //                "text": searchTerm,
    //                "api_key": "search-WE7i6v8",
    //                "size": "3",
    //                "boundary.circle.lat": "37.338",
    //                "boundary.circle.lon": "-121.886",
    //                "boundary.circle.radius": "50"
    //            },
    //            success: function (data, success, jqXHR) {
    //                $dropdownMenu = $(e.srcElement.nextElementSibling).find('.dropdown-menu');
    //                data.features.forEach(function(feature, i) {
    //                    $dropdownMenu.append( '<li class="geocode-address" data='+feature.geometry.coordinates.reverse()+'>'+feature.properties.label+' '+feature.properties.postalcode+'</li>' );
    //                    if (i+1 !== data.features.length) {
    //                        $dropdownMenu.append( '<li class="divider"></li>' );
    //                    }
    //                });
    //                $('.geocode-address').click(function(e) {
    //                    var lat = $(e.currentTarget).attr('data').split(',')[0],
    //                        lng = $(e.currentTarget).attr('data').split(',')[1],
    //                        address = $(this).text();
    //                    $(this).parents('.input-group-btn').prev('.address-input').val(address);
    //                    houses[address] = {'lat': lat, 'lng': lng};
    //                });
    //                $(e.srcElement.nextElementSibling.firstElementChild).dropdown('toggle');
    //                foo = data;
    //                console.log(data);
    //            },
    //            error: function (jqXHR, status, error) {
    //                console.log(error);
    //            }
    //        });
    //    }
    //},
    getRouteTemp: function () {
        var addresses = this.settings.addressList;
        var coords = '';
        addresses.each(function(i, address) {
            var coord = $(address).attr('data')
            if (coords === '') {
                coords += coord
            }
            else {
                coords += ' ' + coord
            }
        });
        console.log(coords);
    },
    getRoute: function (data) {
        console.log(data);
        var routePath = [];
        $.each(data, function(i, address) {
            routePath.push(L.Routing.waypoint([address.lat, address.lon]))
        });
        route.setWaypoints(routePath);
        route.route();
    },

    getRouteOrder: function () {
        var self = this;
        var addresses = this.settings.addressList;
        var coords = '';
        addresses.each(function(i, address) {
            var coord = $(address).attr('data')
            if (coords === '') {
                coords += coord
            }
            else {
                coords += ' ' + coord
            }
        });
        console.log(coords);
        $.ajax({
            url: 'http://localhost:5000/',
            method: 'POST',
            dataType: 'json',
            data: {'coords': coords},
            success: function (data) {
                console.log(data);
                var orderedRoute = {};
                data.forEach(function (address, i) {
                   orderedRoute[i] = {'lat': address.x, 'lon': address.y}
                });
                self.getRoute(orderedRoute);
            },
            error: function (error) {
                return false;
            }
        });
    }
}