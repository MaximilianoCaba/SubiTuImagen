'use strict';

var InfiniteList = (function () {
  var pub = {};

  var offset = 0;
  var limit = 15; /* enough elements to activate the scrollbar*/
  var serviceEndpoint = null;
  var displayFunction = null;

  /* simulate a webservice */
  function getFakeData(offset, limit, callback) {
    var data = [];
    var i;
    var id;
    for (i = 0; i < limit; i++) {
      id = offset + i;
      data.push({
        id: id,
        name: "Name " + id,
        description: "Description " + id
      });
    }
    setTimeout(function () {
      callback(null, data);
    }, 1000); /* simulate 1s delay for the service call */
  }

  /* real Http service */
  function getRealData(offset, limit, callback, serviceEndpoint) {
    var err = {};
    $.ajax({
      'url' : serviceEndpoint,
      'type' : 'GET',
      'data' : {
        'offset' : offset,
        'limit' : limit
      },
      'success' : function (data) {
        callback(null, data);
      },
      'error' : function (data, status, error) {
        err.push(status);
        err.push(error);
        callback(err, data);
      }
    });
  }

  /* loop over the data and display it inside the page*/
  function display(err, datas) {
    if (err) {
      console.log('Something went wrong', err);
    } else {
      $.each(datas, function (i, data) {
        $.each(data, function (key, val) {
          $('#infinite-list').append('<span>' + key + ': ' + val + '</span><br>');
        });
        $('#infinite-list').append('<hr>');
      });
    }
  }

  function loadData(o, l) {
    if (arguments.length !== 2) {
      console.log('Usage: InfiniteList.loadData(offset, length)');
    } else {
      if (serviceEndpoint === 'local') {
        getFakeData(o, l, displayFunction);
      } else {
        getRealData(o, l, displayFunction, serviceEndpoint);
      }
    }
  }

  /* setDisplay()*/
  function setDisplay(d) {
    if (d === null || d === undefined) {
      displayFunction = display;
    } else {
      displayFunction = d;
    }
  }

  /* setService */
  function setService(s) {
    if (s === null || s === undefined) {
      serviceEndpoint = 'local';
    } else {
      serviceEndpoint = s;
    }
  }

  /* when scrolling to the bottom start loading the new stuff */
  $(document).ready(function () {
    $("#infinite-list").scroll(function () {
      var infiniteList = $('#infinite-list');
      if (infiniteList.scrollTop() + infiniteList.innerHeight() >= infiniteList.prop('scrollHeight')) {
        offset += limit;
        loadData(offset, limit);
      }
    });
  });

  /* define public methods for the module */
  pub.setDisplay = setDisplay;
  pub.setService = setService;
  pub.loadData = loadData;

  return pub;
}());

