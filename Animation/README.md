# UX AUTO GULP버전

## 환경 설정

gulpfile.js 내에 변경해야하는 내용이 있습니다.

projectName는 uxdev.etribe.co.kr에 파일을 올릴 경우에 겹치지 않은 경로로 지정해주세요.

## 설치 방법

### node.js 설치
> https://nodejs.org/en/

LTS버전을 다운로드하여 설치 합니다.

### gulp-cli 설치

cmd실행 후
> npm i -g gulp-cli

실행합니다.

### 해당 폴더 node_modules설치

cmd로 터미널을 연 후
> npm i

입력하거나

node_modules.zip 압축 해제합니다.(windows 7 64bit 권장)

### 실행방법

cmd로 터미널을 연 후
> cd d:/해당폴더

해당 폴더로 이동합니다.

이동 후

> gulp

실행합니다.

> gulp all

모든 jade(pug), less 파일을 변환합니다.

> gulp deploy

설정한 경로(projectName과 ftp 설정)로 ftp 업로드합니다.

기본설정은 uxdev.etribe.co.kr/프로젝트이름

> gulp bak

백업하기 

## 추가 옵션(선택)

### growl설치

해도되고 안해도 되는 기능들입니다만 적용하면 편할 수도 있습니다.

> http://www.growlforwindows.com/gfw/d.ashx?f=GrowlInstaller.exe

푸쉬 좀 미려하게 보이는 프로그램입니다.

윈도우만 해당하고 맥에선 설치 안하셔도 미려하게 잘 보입니다.


## 패치
### npm 업데이트

> npm -v

버전에 3.xx이하이면 업데이트 하셔야합니다.
> npm i -g npm

명령어 입력 후 다시 npm -v로 업데이트가 되면 업데이트가 된것이고
안되었다면 node를 최신버전으로 설치해야 합니다.(4.x LTS 설치 권장)

