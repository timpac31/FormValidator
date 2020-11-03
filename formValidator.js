/*
 * author : Á¶¿µ´ö
 * since : 2020.10.
 */

var formValidator = (function() {
	var validFormat = function(name) {
		return name + ' Çü½ÄÀÌ Àß¸øµÇ¾ú½À´Ï´Ù';
	};

	var message = {
		required: function(name, param) { return name + 'À»(¸¦) ÀÔ·ÂÇÏ½Ê½Ã¿À'; },
		email: function(name, param) { return validFormat(name); },
		emailFirst: function(name, param) { return validFormat(name); },
		emailLast: function(name, param) { return validFormat(name); },
		phone: function(name, param) { return validFormat(name); },
		phoneHyphen: function(name, param) { return validFormat(name); },
		phoneOnlyNum: function(name, param) { return validFormat(name); },
		max: function(name, param) { return name + ' °ªÀº ' + param[0] + 'À» ÃÊ°úÇÒ ¼ö ¾ø½À´Ï´Ù'; },
		min: function(name, param) { return name + ' °ªÀº ' + param[0] + 'ÀÌ»óÀÌ¿©¾ß ÇÕ´Ï´Ù'; },
		between: function(name, param) { return name + ' °ªÀº ' + param[0] + '~' + param[1] + ' »çÀÌ¿¡ ÀÖ¾î¾ßÇÕ´Ï´Ù'; },
		length: function(name, param) { return name + 'ÀÇ ±æÀÌ´Â ' + param[0] + 'ÀÚ¿©¾ßÇÕ´Ï´Ù'; },
		maxLength: function(name, param) { return name + 'ÀÇ ±æÀÌ´Â ' + param[0] + 'ÀÚ ÀÌÇÏ¿©¾ßÇÕ´Ï´Ù'; },
		minLength: function(name, param) { return name + 'ÀÇ ±æÀÌ´Â ' + param[0] + 'ÀÚ ÀÌ»ó¿©¾ßÇÕ´Ï´Ù'; },
		betweenLength: function(name, param) { return name + 'ÀÇ ±æÀÌ´Â ' + param[0] + 'ÀÚ ÀÌ»ó ' + param[1] + 'ÀÚ ÀÌÇÏ¿©¾ßÇÕ´Ï´Ù'; },
		onlyNum: function(name, param) { return name + ' °ªÀº ¼ıÀÚ¸¸ ÀÔ·ÂÇÒ ¼ö ÀÖ½À´Ï´Ù'; },
		yyyymmdd: function(name, param) { return validFormat(name); },
		equalTo: function(name, param) { return name + ' °ªÀÌ ´Ù¸¨´Ï´Ù'; },
		notKorean: function(name, param) { return name + 'Àº(´Â) ÇÑ±ÛÀ» ÀÔ·ÂÇÒ ¼ö ¾ø½À´Ï´Ù'; }
	};

	var labels = document.getElementsByTagName('label');

	var getLabelText = function(id) {
		for(var i=0; i<labels.length; i++) {
			var htmlFor = labels[i].htmlFor;
			if(labels[i].htmlFor == id) {
				return labels[i].innerText;
			}
		}
		return null;
	};

	/* 
	 * HTML elements¸¦ Validator °´Ã¼ ¹è¿­·Î º¯È¯ÇÑ´Ù
	 * return [ 
	 *	elem: target Element, name:°æ°í¸Ş½ÃÁö ÀÌ¸§, value:input °ª, rules: [ rule:valid-rule, params:[...ÆÄ¶ó¹ÌÅÍ] ], type:element type
	 * ]
	 */
	var parse = function(elements) {
		var retData = [];

		for(var i=0; i<elements.length; i++) {
			var el = elements[i];
			var validRule = el.getAttribute("valid-rule");
			var validGroup = el.getAttribute("valid-group");

			if(validRule) {
				var rulesArray = validRule.split('|');
				var rules = rulesArray.reduce(function(ret, rule) {    
					var params = rule.split('-');
					ret.push({
						rule: params[0],
						params: params.slice(1) 
					});
					return ret;
				}, []);
				
				var name = '';	//name ¿ì¼±¼øÀ§ 1. valid-name attribute 2.label text 3.element name
				if(el.getAttribute("valid-name")) {
					name = el.getAttribute("valid-name");
				}else {
					name = getLabelText(el.id) || el.name;
				}

				var type = '';
				var value = '';
				if(validGroup) {					
					type = 'group';
					value = 0;
					var els = document.getElementsByName(validGroup);
					for(var j=0, len = els.length; j<len; j++) {
						if(els[j].checked) value++;
					}
				}else if(el.type === 'select-multiple') {
					type = 'group';
					value = 0;
					var ops = document.getElementsByName(el.name)[0].options;
					for(var j=0, len = ops.length; j<len; j++) {
						if(ops[j].selected) value++;
					}
				}else {
					type = el.type;
					value = el.value;
				}

				retData.push({
					elem: el,
					name: name,
					value: value,
					rules: rules,
					type: type
				});
			}
		}	
		return retData;
	};

	
	/* ¼Ó¼ºÀÌ Á¦´ë·Î Á¤ÀÇ µÇ¾ú´ÂÁö Ã¼Å©. Àß¸øµÇ¾úÀ¸¸é error ¹ß»ı */
	var checkValidRule =  function(fvDatas) {
		var onlyNumberParamFn = ['max', 'min', 'between', 'maxLength', 'minLength', 'betweenLength', 'length'];

		for(var i=0; i<fvDatas.length; i++) {
			var fvData = fvDatas[i];
			for(var j=0, len=fvData.rules.length; j<len; j++) {
				var rule = fvData.rules[j];

				if(onlyNumberParamFn.indexOf(rule.rule) !== -1) {
					rule.params.forEach(function(param) {
						if(!formValidator.onlyNum(param)) {
							throw new TypeError(rule.rule + ' functionÀÇ ÆÄ¶ó¹ÌÅÍ´Â ¼ıÀÚ¸¸ °¡´ÉÇÕ´Ï´Ù. param:' + param + ' is not available');
						}
					});
				}

			}
		}	
	};


	var errorText = document.createElement('div');
	errorText.style = 'color:#ff0000; font-size:10pt; padding:5px;';

	var invalidAlert = function(el, name, ruleName, params, alertOption) {
		if(alertOption === 'window') {
			alert(message[ruleName](name, params));
		}else if(alertOption === 'text') {
			errorText.innerText = message[ruleName](name, params);
			el.after(errorText);
			el.focus();
		}else {
			throw new Error(alertOption + ' Àº Àß¸øµÈ alert ¿É¼ÇÀÔ´Ï´Ù.');
		}
	};


	
	/** Global start **/
	return {
		
		/* formÀÇ valid-rule ¼Ó¼ºÀÌÀÖ´Â elements¸¦ ÀüÃ¼ °ËÁõÇÑ´Ù.
		 * ¼º°øÇÏ¸é true ¸®ÅÏ
		 * ½ÇÆĞÇÏ¸é alert(message[rule]) ¶ç¿ì°í false ¸®ÅÏ 
		 */
		validate: function(form, alertOption) {
			var fvDatas = parse(form.elements);				
			//console.log(fvDatas);
			checkValidRule(fvDatas);

			for(var i=0; i<fvDatas.length; i++) {
				var fvData = fvDatas[i];
				for(var j=0, len=fvData.rules.length; j<len; j++) {
					var rule = fvData.rules[j];
					var ruleName = rule.rule;

					var isValid = true;
					if(ruleName === 'required') {
						if(fvData.type === 'group') {
							isValid = formValidator['min'](fvData.value, [1]);
						}else {
							isValid = formValidator['required'](fvData.value);
						}
					}else {
						if(fvData.value !== '') {
							isValid = ( (rule.params.length > 0) ? formValidator[ruleName](fvData.value, rule.params) : formValidator[ruleName](fvData.value) );										
						}
					}
					
					if(!isValid) {
						invalidAlert(fvData.elem, fvData.name, ruleName, rule.params, alertOption);
						return false;
					}
				}
			}

			return true;
		},

		
		addChecker: function(form) {
			var fvDatas = parse(form.elements);
			checkValidRule(fvDatas);
			
			for(var i=0; i<fvDatas.length; i++) {
				var fvData = fvDatas[i];
				for(var j=0, len=fvData.rules.length; j<len; j++) {
					var rule = fvData.rules[j];
					//TODO: °ËÁõ ÀÌº¥Æ®  keyup, focusout µî·Ï

				}

			}


		},

		
		/* À¯È¿¼º °ËÁõ ·ÎÁ÷ */
		"required" : function(val) {			
			return (val != null && val != undefined && val.trim() !== '');
		},
		"email" : function(val) {
			return /^[a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(val);
		},
		"emailFirst" : function(val) {
			return /^[a-zA-Z]([-_\.]?[0-9a-zA-Z])$/.test(val);
		},
		"emailLast" : function(val) {
			return /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(val);
		},				
		
		"phoneHyphen" : function(val) {
			return /^([0-9]{2,3})-([0-9]{3,4})-([0-9]{4})$/.test(val);
		},
		
		"phoneOnlyNum" : function(val) {
			return /^([0-9]{2,3})([0-9]{3,4})([0-9]{4})$/.test(val);
		},
		
		"phone" : function(val) {
			return (formValidator.phoneHyphen(val) || formValidator.phoneOnlyNum(val));
		},
		
		"max" : function(val, params) {			
			return parseInt(val) <= parseInt(params[0]);
		},

		"min" : function(val, params) {
			return parseInt(val) >= parseInt(params[0]);
		},
		
		"between" : function(val, params) {
			return (parseInt(val) >= parseInt(params[0]) && parseInt(val) <= parseInt(params[1]));
		},
		
		"length:" : function(val, params) {
			return val.length === parseInt(params[0]);
		},

		"maxLength" : function(val, params) {
			return val.length <= parseInt(params[0]);			
		},

		"minLength" : function(val, params) {
			return val.length >= parseInt(params[0]);
		},
		
		"betweenLength" : function(val, params) {
			return (val.length >= parseInt(params[0]) && val.length <= parseInt(params[1]));
		},

		"onlyNum" : function(val) {
			return /^[0-9]+$/.test(val);
		},

		"yyyymmdd" : function(val) {
			return /^([1-2][0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/.test(val);
		},

		"equalTo" : function(val, params) {
			return val === document.getElementById(params[0]).value;
		},
		
		"notKorean" : function(val) {
			return !(/[¤¡-¤¾|¤¿-¤Ó|°¡-ÆR]/.test(val));
		}
		
	};	/** Global end **/
	
})();

