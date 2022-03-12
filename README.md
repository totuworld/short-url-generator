# 단축 url 생성기
express.js, firebase를 이용해서 단축 url을 반환하는 서비스를 만든다.


## 요구사항
* 특정 url `A`을 넘기면 단축 url `B`가 생성된다.
* B를 호출하면 A로 redirect된다.
    * B는 호출 될 때마다 몇 번 조회되었는지 체크한다.
    * * facebook, tweetbot, slack 봇이 조회하면 카운트하지 않는다.
* 생성된 단축 url 목록을 조회할 수 있어야한다.

## 추가 기능
* open graph 태그에 사용할 이미지나 title을 넣을 수 있으면 좋겠다.


## 실행 전 준비사항
* .env 파일을 만들어야함.

```
projectId=firebase project id
privateKey=firebase privete key
clientEmail=firebae client email
PORT=4949
HOST=localhost
PROTOCOL=http
```