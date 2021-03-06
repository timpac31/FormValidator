/*
 * author : 조영덕
 * since : 2020.10.
 * github : https://github.com/timpac31/FormValidator
 */

var formValidator = (function() {
	var validFormat = function(name) {
		return name + ' 형식이 잘못되었습니다';
	};

	var message = {
		required: function(name, param) { return name + '을(를) 입력하십시오'; },
		email: function(name, param) { return validFormat(name); },
		emailFirst: function(name, param) { return validFormat(name); },
		emailLast: function(name, param) { return validFormat(name); },
		phone: function(name, param) { return validFormat(name); },
		phoneHyphen: function(name, param) { return validFormat(name); },
		phoneOnlyNum: function(name, param) { return validFormat(name); },
		max: function(name, param) { return name + ' 값은 ' + param[0] + '을 초과할 수 없습니다'; },
		min: function(name, param) { return name + ' 값은 ' + param[0] + '이상이여야 합니다'; },
		between: function(name, param) { return name + ' 값은 ' + param[0] + '~' + param[1] + ' 사이에 있어야합니다'; },
		length: function(name, param) { return name + '의 길이는 ' + param[0] + '자여야합니다'; },
		maxLength: function(name, param) { return name + '의 길이는 ' + param[0] + '자 이하여야합니다'; },
		minLength: function(name, param) { return name + '의 길이는 ' + param[0] + '자 이상여야합니다'; },
		betweenLength: function(name, param) { return name + '의 길이는 ' + param[0] + '자 이상 ' + param[1] + '자 이하여야합니다'; },
		onlyNum: function(name, param) { return name + ' 값은 숫자만 입력할 수 있습니다'; },
		yyyymmdd: function(name, param) { return validFormat(name); },
		equalTo: function(name, param) { return name + ' 값이 다릅니다'; },
		notKorean: function(name, param) { return name + '은(는) 한글을 입력할 수 없습니다'; }
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
	 * HTML elements를 Validator 객체 배열로 변환한다
	 * return [ 
	 *	elem: target Element, name:경고메시지 이름, value:input 값, rules: [ rule:valid-rule, params:[...파라미터] ], type:element type
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
				
				var name = '';
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

	
	/* 속성이 제대로 정의 되었는지 체크. 잘못되었으면 error 발생 */
	var checkValidRule =  function(fvDatas) {
		var onlyNumberParamFn = ['max', 'min', 'between', 'maxLength', 'minLength', 'betweenLength', 'length'];

		for(var i=0; i<fvDatas.length; i++) {
			var fvData = fvDatas[i];
			for(var j=0, len=fvData.rules.length; j<len; j++) {
				var rule = fvData.rules[j];

				if(onlyNumberParamFn.indexOf(rule.rule) !== -1) {
					rule.params.forEach(function(param) {
						if(!formValidator.onlyNum(param)) {
							throw new TypeError(rule.rule + ' function의 파라미터는 숫자만 가능합니다. param:' + param + ' is not available');
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
			throw new Error(alertOption + ' 은 잘못된 alert 옵션입니다.');
		}
	};


	
	/** Global start **/
	return {
		
		/* form의 valid-rule 속성이있는 elements를 전체 검증한다.
		 * 성공하면 true 리턴
		 * 실패하면 alert(message[rule]) 띄우고 false 리턴 
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
					//TODO: 검증 이벤트  keyup, focusout 등록

				}

			}


		},

		
		/* 유효성 검증 로직 */
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
			return !(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(val));
		}
		
	};	/** Global end **/
	
})();

