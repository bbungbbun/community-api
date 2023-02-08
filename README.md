# 설명
게시판 프로젝트의 게시판의 정보를 관리하는 API입니다. 프론트는 별도의 레포지토리에 업로드 되어있습니다.
- [게시판 프론트 레포지토리 바로가기](https://github.com/bbungbbun/community-front)

## 사용 기술
- node.js
- mySql
- express
- dotenv, cors
- multer

## 목록
- 전체 조회 `GET` `/getAll`
- 해당 글 조회 `GET` `/getBoard`
- 글 작성 `POST` `/write`
- 글 수정 `PATCH` `/modify`
- 글 삭제 `DELETE` `/delete`
- 사진 업로드 테스트 페이지 불러오기 `GET` `/upload` 
- 사진 업로드 `POST` `/upload`
