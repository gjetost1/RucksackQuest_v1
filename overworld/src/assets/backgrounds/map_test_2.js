(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("map_test_2",
{ "compressionlevel":-1,
 "height":12,
 "infinite":false,
 "layers":[
        {
         "data":[81, 82, 61, 61, 61, 61, 81, 81, 61, 82, 82, 82, 81, 82, 81, 61, 61, 61, 61, 61, 61,
            61, 81, 81, 81, 81, 81, 81, 81, 82, 82, 82, 61, 61, 82, 81, 81, 82, 82, 82, 82, 81,
            81, 81, 61, 81, 81, 61, 61, 61, 61, 61, 81, 81, 83, 81, 81, 81, 82, 82, 61, 61, 81,
            81, 82, 82, 82, 83, 61, 61, 82, 81, 81, 81, 81, 81, 81, 61, 82, 82, 61, 61, 61, 61,
            82, 82, 82, 81, 81, 61, 61, 61, 81, 81, 81, 81, 82, 81, 83, 82, 82, 82, 82, 82, 82,
            81, 81, 81, 81, 81, 82, 82, 81, 81, 81, 81, 82, 82, 82, 83, 83, 82, 61, 82, 82, 82,
            81, 81, 81, 83, 81, 81, 81, 81, 81, 82, 81, 81, 82, 82, 82, 83, 61, 82, 82, 82, 82,
            82, 81, 81, 81, 81, 61, 81, 81, 61, 61, 61, 82, 82, 82, 61, 61, 82, 81, 82, 82, 82,
            81, 81, 81, 82, 81, 81, 82, 82, 81, 82, 82, 82, 83, 83, 82, 81, 81, 81, 82, 60, 61,
            81, 82, 81, 60, 61, 81, 82, 81, 81, 83, 83, 83, 81, 83, 82, 81, 82, 81, 83, 81, 82,
            81, 81, 81, 60, 61, 81, 61, 81, 61, 61, 61, 81, 81, 61, 61, 82, 61, 59, 60, 81, 62,
            82, 82, 82, 60, 61, 61, 82, 82, 82, 82, 82, 81, 82, 82, 82, 82, 82, 81, 81, 82, 83],
         "height":12,
         "id":1,
         "name":"background grass",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":21,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 220, 221, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 220, 221, 0, 37, 38, 39, 40, 41, 38, 39, 40, 41, 38, 39, 40, 38, 39, 40, 42,
            0, 0, 220, 220, 0, 58, 202, 199, 203, 0, 202, 220, 220, 220, 203, 0, 0, 0, 0, 0, 84,
            0, 0, 220, 221, 0, 58, 219, 220, 220, 220, 220, 220, 220, 220, 220, 203, 0, 0, 0, 0, 105,
            0, 0, 220, 221, 0, 79, 223, 241, 224, 223, 220, 220, 220, 220, 220, 220, 220, 220, 220, 203, 63,
            0, 0, 220, 220, 0, 100, 101, 102, 102, 58, 223, 220, 220, 220, 224, 0, 0, 0, 0, 223, 203,
            0, 0, 220, 221, 0, 121, 122, 123, 125, 79, 0, 220, 220, 220, 0, 0, 0, 0, 0, 0, 223,
            0, 0, 223, 220, 203, 0, 0, 0, 146, 100, 97, 223, 220, 224, 2147483745, 103, 101, 102, 103, 104, 105,
            0, 0, 0, 223, 220, 203, 0, 0, 0, 121, 118, 119, 220, 2147483767, 2147483766, 124, 122, 123, 124, 125, 126,
            0, 0, 0, 0, 223, 220, 203, 0, 0, 0, 139, 140, 220, 2147483788, 2147483787, 0, 0, 0, 0, 146, 147,
            0, 0, 0, 0, 0, 223, 220, 203, 0, 0, 160, 161, 220, 2147483809, 2147483808, 0, 0, 0, 0, 167, 168,
            0, 0, 0, 0, 0, 0, 223, 220, 220, 220, 220, 220, 220, 0, 0, 0, 0, 0, 0, 188, 189],
         "height":12,
         "id":2,
         "name":"Hills",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":21,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 172, 173, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 193, 0, 0, 0, 0, 0, 0, 0, 0, 0, 214, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 235, 236, 237, 238, 0, 0,
            0, 0, 0, 0, 0, 235, 236, 237, 238, 0, 0, 232, 233, 234, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 173, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 236, 237, 238, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 236, 237, 238, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "id":6,
         "name":"background_objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":21,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 172, 173, 174, 175, 0, 0, 169, 170, 171, 0, 193, 194, 195, 196, 0, 0,
            0, 0, 0, 0, 0, 193, 194, 195, 196, 0, 0, 190, 191, 192, 0, 214, 215, 216, 217, 0, 0,
            0, 0, 0, 0, 0, 214, 215, 216, 217, 0, 0, 211, 212, 213, 0, 235, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 173, 174, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 173, 174, 175, 0, 0,
            0, 194, 195, 196, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 194, 195, 196, 0, 0,
            0, 215, 216, 217, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 215, 216, 217, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "id":4,
         "name":"foreground_objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":21,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "id":5,
         "name":"collisions",
         "opacity":1,
         "type":"tilelayer",
         "visible":false,
         "width":21,
         "x":0,
         "y":0
        }],
 "nextlayerid":7,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.9.2",
 "tileheight":64,
 "tilesets":[
        {
         "firstgid":1,
         "source":"midjo_tileset_test22.tsx"
        }, 
        {
         "firstgid":253,
         "source":"midjo_tileset_test2_big.tsx"
        }],
 "tilewidth":64,
 "type":"map",
 "version":"1.9",
 "width":21
});