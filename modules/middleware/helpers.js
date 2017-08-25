'use strict';

exports.ifEqual = function(a, b, options) {
    if(a == b) {
        return options.fn(this);
    }
    return options.inverse(this);
};

exports.ifNotEqual = function(a, b, options) {
    if(a != b) {
        return options.fn(this);
    }
    return options.inverse(this);
};

exports.ifMayor = function(a, b, options) {
    if(a < b) {
        return options.fn(this);
    }
    return options.inverse(this);
};

exports.ifMayorOrEqual= function(a, b, options) {
    if(a <= b) {
        return options.fn(this);
    }
    return options.inverse(this);
};