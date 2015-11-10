import json

from flask import Response, Flask, request, abort
from flask.ext.cors import CORS

import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect("host=192.168.1.18 dbname=routingsj user=tigren")
curr = conn.cursor(cursor_factory=RealDictCursor)
app = Flask(__name__)
CORS(app)

@app.route('/error-page')
def error():
    return abort(400)

@app.route('/', methods=['POST', 'GET'])
def hello():
    if request.method == 'POST':
        addresses = request.form['coords']
        try:
            curr.execute("""
                WITH vertex_table AS (
                SELECT row_number() over () AS id,
                       coords[1]::float AS x,
                       coords[2]::float AS y
                FROM
                  (SELECT string_to_array(subcoords, ',') AS coords
                   FROM unnest(string_to_array(%s, ' ')) AS subcoords) AS coords)

                   SELECT * from pgr_tsp('SELECT * FROM vertex_table', 1, %s) as route, vertex_table
                   WHERE route.id2 = vertex_table.id
                   ORDER BY route.seq;
                   """,
                         (addresses, len(addresses.split(' '))))
        except psycopg2.Error, e:
            conn.rollback()
            return abort(400)

        resp = curr.fetchall()
        # return json.dumps(resp)
        return Response(json.dumps(resp), mimetype='application/json')
        # return str(resp)
    return 'Send me some addresses'

if __name__ == "__main__":
    app.run(debug=True)
    # app.run()