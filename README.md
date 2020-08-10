# EC2와 S3를 이용한 이미지 업로드

### demo
http://ec2-3-21-221-108.us-east-2.compute.amazonaws.com:8080/gallery

### architecture
![archi.PNG](./readImg/archi.PNG)

### 주요 성과
    1. EC2 - S3 연동
        - EC2 IAM 등록
        - EC2 특정 IP만 접근 가능
        - S3 버킷정책 및 CORS 구성
    
    2.  외부 .js 라이브러리 사용 및 직접 구현
        - pagination.js을  통한 paging 처리
        - toast.js 를 통한 토스트 메세지 노출
        - clipboard.js를 통한 copy & paste 업로드 구현
        - drag & drop 업로드 구현
