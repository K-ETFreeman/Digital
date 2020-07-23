"use strict";

//IE HTMLcollection foreach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

;
var subnavSwiper = new Swiper('.subnav__swiper', {
  direction: 'horizontal',
  breakpoints: {
    320: {
      slidesPerView: 1
    },
    700: {
      slidesPerView: 2
    },
    1050: {
      slidesPerView: 3,
      spaceBetween: 35
    },
    1160: {
      slidesPerView: 4,
      spaceBetween: 35
    },
    1261: {
      allowTouchMove: false,
      slidesPerView: 5,
      spaceBetween: 35
    }
  },
  navigation: {
    nextEl: '.subnav__right',
    prevEl: '.subnav__left'
  }
});
; //tags logic, IE-compatible

var LArrow = document.querySelector('.tags-linewrapper-leftarrow'),
    RArrow = document.querySelector('.tags-linewrapper-rightarrow');
var LineWrapper = document.querySelector('.tags-linewrapper:first-child'),
    Line = document.querySelector('.tags-linewrapper:first-child .tags-line');
var TagsOffset = 0;

function checkArrows(offset) {
  var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Line.querySelector('a:last-child').getBoundingClientRect().right;
  if (offset == 0) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');else LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
  if (end > LineWrapper.getBoundingClientRect().right) RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');else RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
}

checkArrows(0);

function findEdges() {
  var padding = parseFloat(getComputedStyle(LineWrapper.querySelector('.tags-linewrapper-content')).getPropertyValue('padding-left'));
  var Ledge = LineWrapper.getBoundingClientRect().left + padding;
  var Redge = LineWrapper.getBoundingClientRect().right - padding;
  var l = undefined,
      r = 0,
      falseL = 0;

  for (var i = 0; i < Line.children.length; i++) {
    var item = Line.children[i];
    if (item.classList.contains('tags-line-item_selected')) continue;

    if (item.getBoundingClientRect().left >= Ledge) {
      l = i;
      Ledge = Infinity;
    }

    if (item.getBoundingClientRect().right <= Redge) r = i;
    falseL = i;
  }

  if (l == undefined) l = falseL;
  if (false == undefined) TagsOffset = 0;
  Ledge = LineWrapper.getBoundingClientRect().left + padding;
  var firstRight = undefined,
      firstLeft = undefined,
      secondLeft = undefined,
      secondRight = undefined;

  for (var _i = r + 1; _i < Line.children.length; _i++) {
    var _item = Line.children[_i];

    if (!_item.classList.contains('tags-line-item_selected')) {
      if (!firstRight) {
        firstRight = _item;

        if (firstRight.getBoundingClientRect().right - Redge < 3) {
          firstRight = undefined;
        }

        continue;
      }

      secondRight = _item;
      break;
    }
  }

  for (var _i2 = l == falseL ? l : l - 1; _i2 >= 0; _i2--) {
    var _item2 = Line.children[_i2];

    if (!_item2.classList.contains('tags-line-item_selected')) {
      if (!firstLeft) {
        firstLeft = _item2;

        if (Ledge - firstLeft.getBoundingClientRect().left < 3) {
          firstLeft = undefined;
        }

        continue;
      }

      secondLeft = _item2;
      break;
    }
  }

  return {
    'Ledge': Line.children[l].getBoundingClientRect().left,
    'Redge': Line.children[r].getBoundingClientRect().right,
    'l': l,
    'r': r,
    'AllowRightOffset': Redge - Line.children[r].getBoundingClientRect().right,
    'RightOffset': firstRight ? firstRight.getBoundingClientRect().right - Redge : undefined,
    'LeftOffset': firstLeft ? Ledge - firstLeft.getBoundingClientRect().left : undefined,
    'rightEnd': firstRight == undefined || Line.children.length == 0 ? true : false,
    'leftEnd': firstLeft == undefined || Line.children.length == 0 ? true : false,
    'leftWillEnd': secondLeft == undefined ? true : false,
    'rightWillEnd': secondRight == undefined ? true : false
  };
}

RArrow.onclick = function () {
  var data = findEdges();

  if (data.RightOffset) {
    TagsOffset -= data.RightOffset;
    Line.style.transform = "translateX(" + TagsOffset + 'px)';
    if (TagsOffset < 0) LArrow.classList.remove('tags-linewrapper-leftarrow_hidden');
  }

  if (data.rightWillEnd || data.RightOffset == undefined) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');
};

LArrow.onclick = function () {
  var data = findEdges();

  if (data.LeftOffset) {
    if (data.RightOffset || data.LeftOffset > data.AllowRightOffset) RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
    TagsOffset += data.LeftOffset;
    Line.style.transform = "translateX(" + TagsOffset + 'px)';
  }

  if (data.leftWillEnd) LArrow.classList.add('tags-linewrapper-leftarrow_hidden');
};

window.addEventListener('resize', function () {
  var data = findEdges();
  if (data.RightOffset == undefined || data.rightEnd) RArrow.classList.add('tags-linewrapper-rightarrow_hidden');else RArrow.classList.remove('tags-linewrapper-rightarrow_hidden');
  scratchFooterTags();
});

(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }

    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

function scratchFooterTags() {
  var prevHeight;
  document.querySelectorAll('.footerTags-content-item').forEach(function (item) {
    item.classList.remove('footerTags-content-item_notfirst');
    var itemHeight = item.getBoundingClientRect().bottom;

    if (prevHeight == undefined) {
      prevHeight = itemHeight;
    } else {
      if (itemHeight == prevHeight) {
        item.classList.add('footerTags-content-item_notfirst');
      } else {
        prevHeight = itemHeight;
      }
    }
  });
}

window.addEventListener('load', function () {
  scratchFooterTags();
});
;

function ibg() {
  var ibg = document.querySelectorAll(".ibg");

  for (var i = 0; i < ibg.length; i++) {
    var img = void 0,
        arr = void 0;
    arr = ibg[i].querySelectorAll('.ibg__image');

    for (var j = 0; j < arr.length; j++) {
      if (getComputedStyle(arr[j]).display != "none") {
        img = arr[j];
        break;
      }
    }

    if (img) {
      ibg[i].style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
    } else {}
  }
}

ibg();
;
document.querySelectorAll('.interactive-trigger').forEach(function (item) {
  return item.addEventListener('click', function () {
    var target = item.getAttribute('data-target'),
        selector = item.getAttribute('data-sel'),
        toggleClass = item.getAttribute('data-toggleclass'),
        detailsMode = item.getAttribute('data-detailsMode');
    if (target == "this") target = item;
    if (target == "parent") target = item.parentNode;
    if (target == "grandparent") target = item.parentNode.parentNode;
    if (!target) target = document;
    if (selector) return target.querySelectorAll(selector).forEach(function (item) {
      if (detailsMode && item.classList.contains('details')) {
        if (item.style.maxHeight) item.style.removeProperty('max-height');else item.style.maxHeight = item.scrollHeight + 'px';
      }

      item.classList.toggle(toggleClass);
    });
    return target.classList.toggle(toggleClass);
  });
});
;
var placeholder = document.querySelector('.video');
var vid;

function getVideoHtml(width, height) {
  return '<iframe width="' + width + '"height="' + height + '" src="https://www.youtube.com/embed/592arVyUtEc?autoplay=1" frameborder="0" allow="accelerometer; autoplay="1"; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

placeholder.onclick = function (e) {
  document.querySelector('.video__shapecreator').innerHTML = getVideoHtml(placeholder.getBoundingClientRect().width, placeholder.getBoundingClientRect().height);
  vid = document.querySelector('.video__shapecreator iframe');
};