var AddressInput = {
    settings: {
        inputList: $('.address-input')
    },

    addAddressLine: function (e) {
        $('.houses').append('<div class="input-group">' +
                '<input type="text" class="address-input form-control" aria-label="..." onkeypress="getAddress(event)">' +
                '<div class="input-group-btn">' +
                '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"' +
                'aria-expanded="false">Choose <span class="caret"></span></button>' +
                '<ul class="dropdown-menu">' +
                '</ul>' +
                '</div><!-- /btn-group -->' +
                '</div><!-- /input-group -->');
        this.settings.inputList.keypress(this.getAddress(e));
    },

    getAddressSuccess: function (data) {

    },

    getAddress: function (e) {
        if (e.keyCode === 13) {
            var searchTerm = e.srcElement.value;
            $.ajax({
                url: 'https://search.mapzen.com/v1/search',
                dataType: 'json',
                data: {
                    'text': searchTerm,
                    'api_key': 'search-WE7i6v8',
                    'size': '3',
                    'boundary.circle.lat': '37.338',
                    'boundary.circle.lon': '-121.886',
                    'boundary.circle.radius': '50'
                },
                success: function (data, success) {
                    var $dropdownMenu = $(e.srcElement.nextElementSibling).find('.dropdown-menu');
                    data.features.forEach(function(feature, i) {
                        $dropdownMenu.append( '<li class="geocode-address" data='+feature.geometry.coordinates.reverse()+'>'+feature.properties.label+' '+feature.properties.postalcode+'</li>' );
                        if (i+1 !== data.features.length) {
                            $dropdownMenu.append( '<li class="divider"></li>' );
                        }
                    });
                    $('.geocode-address').click(function(e) {
                        bar = this;
                        var lat = $(e.currentTarget).attr('data').split(',')[0],
                            lng = $(e.currentTarget).attr('data').split(',')[1],
                            address = $(this).text();
                        $(this).parents('.input-group-btn').prev('.address-input').val(address);
                        houses[address] = {'lat': lat, 'lng': lng};
                    });
                    $(e.srcElement.nextElementSibling.firstElementChild).dropdown('toggle');
                    foo = data;
                    console.log(data);
                },
                error: function (jqXHR, status, error) {
                    console.log(error);
                }
            });
        }
    }
};