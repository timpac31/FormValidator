## formValidator
> HTML 기반 form 유효성 검사 라이브러리
<br/>

## Simple Practice 
**1. form 전체 검증**
~~~
<script src="formValidator.js"></script>

<form id="frm" name="myForm">
	<label for="username" class="tag">이름</label>
	<input type="text" id="username" name="username" valid-name="성명" valid-rule="required" />
	<label for="useremail" class="tag">이메일</label>
	<input type="text" id="useremail" name="useremail" valid-rule="email" />
	<button type="button" class="btn" onclick="validate(myForm);">submit</button>
</form>

<script>
var alertOption = 'window';    //알림 옵션 window일 경우 alert 창으로 오류 알림
//var alertOption = 'text';  //알림 옵션 text일 경우 입력폼 아래 text로 알림

function validate(form) {
	if(formValidator.validate(form, alertOption)) {
		alert('validation success');
	}
}
</script>
~~~
<br/>

**2. element 하나씩 검증**
~~~
<script src="formValidator.js"></script>

<form id="frm" name="myForm">
	<label for="username" class="tag">이름</label>
	<input type="text" id="username" name="username" />
	<label for="useremail" class="tag">이메일</label>
	<input type="text" id="useremail" name="useremail" />
	<button type="button" class="btn" onclick="validate(myForm);">submit</button>
</form>

<script>
function validate(form) {
	if(!formValidator.required(form.username.value)) {
		alert('이름은 필수입력입니다');
		return false;
	}
	if(!formValidator.email(form.usermail.value)) {
		alert('이메일 형식이 잘못되었습니다');
		return false;
	}

	alert('validation success');
}
</script>
~~~
<br/>

## Attribute
 * **valid-name**
   * 경고 메시지의 타겟 이름을 정합니다.  
   * 우선순위는 다음과 같습니다.
  ~~~
  1. valid-name 속성이 있는 경우
  <label for="username">이름</label><input type="text" id="username" name="username" valid-name="성명" valid-rule="required" /> ==> 성명
  
  2. valid-name 속성이 없을경우 label의 text값으로 설정
  <label for="username">이름</label><input type="text" id="username" name="username" valid-rule="required" /> ==> 이름
  
  3. valid-name 속성과 label도 없을 때는 element의 name값으로 설정
  <input type="text" id="username" name="username" valid-rule="required" /> ==> username
  ~~~
<br/>
  
 * **valid-rule**
   * 검증룰 속성을 설정합니다 : [[valid-rule]](#valid-rule)
   * 구분자 | 를 사용하여 하나의 element에 여러개의 룰을 설정할 수 있습니다. 
    예) valid-rule="required|maxLength-10|onlyNum"
   * rule 뒤에 구분자 - 를 사용하여 파라미터를 설정할 수 있습니다. 예) valid-rule="between-2-5"  //숫자 2~5사이의 값만 허용
<br/>

 * **valid-group**
   * radio나 checkbox type인 경우 그룹을 만들어 rule을 정합니다. valid-group 값은 radio,checkbox의 name과 같아야 합니다.
~~~
    <fieldset valid-group="hobby" valid-name="취미" valid-rule="required">
      <input type="checkbox" name="hobby" id="hobby1" value="독서" /><label for="hobby1">독서</label>
		  <input type="checkbox" name="hobby" id="hobby2" value="운동" /><label for="hobby2">운동</label>
    </fieldset>
~~~
<br/>				

## <span id="valid-rule">valid-rule</span>
  rule name        | Description                                | parameter                   
-------------------|--------------------------------------------|--------------------------------------
`required`         | `필수값 검증`                               | `none`                      
`email`            | `이메일 유효성 검증, abc@abc.com`           | `none`                     
`emailFirst`       | `이메일 앞자리`                             | `none`                     
`emailLast`        | `이메일 뒷자리`                             | `none`                      
`phoneHyphen`      | `전화번호 -포함`                            | `none`                     
`phoneOnlyNum`     | `전화번호 -제외`                            | `none`                     
`phone`            | `전화번호 -포함/제외 둘다 허용`              | `none`                     
`max`              | `파라미터 값 이하만 허용`                    | `[max number]`             
`min`              | `파라미터 값 이상만 허용`                    | `[min number]`             
`between`          | `파라미터 값 사이의 값만 허용`               | `[min number, max number]` 
`length`           | `파라미터 값과 같은 문자 길이만 허용`         | `[length number]`          
`maxLength`        | `파라미터 값 이하의 문자 길이만 허용`         | `[max length number]`      
`minLength`        | `파라미터 값 이상의 문자 길이만 허용`         | `[min length number]`      
`betweenLength`    | `파라미터 값 사이의 문자 길이만 허용`         | `[min length number, max length number]`  
`onlyNum`          | `숫자만 허용`                               | `none`                     
`yyyymmdd`         | `년도4자리 월2자리 일2자리`                  | `none`                     
`equalTo`          | `다른 element와 값 같은지 판단`              | `[element id]`                     
`notKorean`        | `한글 입력 불가능`                           | `none`                     
<br/>

## Auth
JYD(timpac61@gmail.com)
