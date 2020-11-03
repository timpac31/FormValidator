## formValidator
> HTML Element Attribute ��� form ��ȿ�� �˻� ���̺귯��
<br/>

## Simple Practice 
**1. form ��ü ����**
~~~
<script src="formValidator.js"></script>

<form id="frm" name="myForm">
	<label for="username" class="tag">�̸�</label>
	<input type="text" id="username" name="username" valid-name="����" valid-rule="required" />
	<label for="useremail" class="tag">�̸���</label>
	<input type="text" id="useremail" name="useremail" valid-rule="email" />
	<button type="button" class="btn" onclick="validate(myForm);">submit</button>
</form>

<script>
var alertOption = 'window';    //�˸� �ɼ� window�� ��� alert â���� ���� �˸�
//var alertOption = 'text';  //�˸� �ɼ� text�� ��� �Է��� �Ʒ� text�� �˸�

function validate(form) {
	if(formValidator.validate(form, alertOption)) {
		alert('validation success');
	}
}
</script>
~~~
<br/>

**2. element �ϳ��� ����**
~~~
<script src="formValidator.js"></script>

<form id="frm" name="myForm">
	<label for="username" class="tag">�̸�</label>
	<input type="text" id="username" name="username" />
	<label for="useremail" class="tag">�̸���</label>
	<input type="text" id="useremail" name="useremail" />
	<button type="button" class="btn" onclick="validate(myForm);">submit</button>
</form>

<script>
function validate(form) {
	if(formValidator.required(form.username.value)) {
		alert('�̸��� �ʼ��Է��Դϴ�');
		return false;
	}
	if(formValidator.email(form.usermail.value)) {
		alert('�̸��� ������ �߸��Ǿ����ϴ�');
		return false;
	}

	alert('validation success');
}
</script>
~~~
<br/>

## Attribute
 * **valid-name**
   * ��� �޽����� Ÿ�� �̸��� ���մϴ�.  
   * �켱������ ������ �����ϴ�.
  ~~~
  1. valid-name �Ӽ��� �ִ� ���
  <label for="username">�̸�</label><input type="text" id="username" name="username" valid-name="����" valid-rule="required" /> ==> ����
  
  2. valid-name �Ӽ��� ������� label�� text������ ����
  <label for="username">�̸�</label><input type="text" id="username" name="username" valid-rule="required" /> ==> �̸�
  
  3. valid-name �Ӽ��� label�� ���� ���� element�� name������ ����
  <input type="text" id="username" name="username" valid-rule="required" /> ==> username
  ~~~
<br/>
  
 * **valid-rule**
   * ������ �Ӽ��� �����մϴ� : [[valid-rule]](#valid-rule)
   * ������ | �� ����Ͽ� �ϳ��� element�� �������� ���� ������ �� �ֽ��ϴ�. ��) valid-rule="required|maxLength-10|onlyNum"
   * rule- �ڿ� ������ ������ �Ķ���͸� �����մϴ�. ��) valid-rule="between-2-5"  //���� 2~5������ ���� ���
<br/>

 * **valid-group**
   * radio�� checkbox type�� ��� �׷��� ����� rule�� ���մϴ�. valid-group ���� radio,checkbox�� name�� ���ƾ� �մϴ�.
~~~
    <fieldset valid-group="hobby" valid-name="���" valid-rule="required">
      <input type="checkbox" name="hobby" id="hobby1" value="����" /><label for="hobby1">����</label>
		  <input type="checkbox" name="hobby" id="hobby2" value="�" /><label for="hobby2">�</label>
    </fieldset>
~~~
<br/>				

## <span id="valid-rule">valid-rule</span>
  rule name        | Description                                | parameter                   
-------------------|--------------------------------------------|--------------------------------------
`required`         | `�ʼ��� ����`                               | `none`                      
`email`            | `�̸��� ��ȿ�� ����, abc@abc.com`           | `none`                     
`emailFirst`       | `�̸��� ���ڸ�`                             | `none`                     
`emailLast`        | `�̸��� ���ڸ�`                             | `none`                      
`phoneHyphen`      | `��ȭ��ȣ -����`                            | `none`                     
`phoneOnlyNum`     | `��ȭ��ȣ -����`                            | `none`                     
`phone`            | `��ȭ��ȣ -����/���� �Ѵ� ���`              | `none`                     
`max`              | `�Ķ���� �� ���ϸ� ���`                    | `[max number]`             
`min`              | `�Ķ���� �� �̻� ���`                    | `[min number]`             
`between`          | `�Ķ���� �� ������ ���� ���`               | `[min number, max number]` 
`length`           | `�Ķ���� ���� ���� ���� ���̸� ���`         | `[length number]`          
`maxLength`        | `�Ķ���� �� ������ ���� ���̸� ���`         | `[max length number]`      
`minLength`        | `�Ķ���� �� �̻��� ���� ���̸� ���`         | `[min length number]`      
`betweenLength`    | `�Ķ���� �� ������ ���� ���̸� ���`         | `[min length number, max length number]`  
`onlyNum`          | `���ڸ� ���`                               | `none`                     
`yyyymmdd`         | `�⵵4�ڸ� ��2�ڸ� ��2�ڸ�`                  | `none`                     
`equalTo`          | `�ٸ� element�� �� ������ �Ǵ�`              | `[element id]`                     
`notKorean`        | `�ѱ� �Է� �Ұ���`                           | `none`                     
<br/>

## Auth
JYD(timpac61@gmail.com)
