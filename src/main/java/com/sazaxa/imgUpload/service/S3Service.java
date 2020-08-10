package com.sazaxa.imgUpload.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
@NoArgsConstructor
public class S3Service {

    private AmazonS3 s3Client;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    @PostConstruct
    public void setS3Client() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(this.region)
                .build();
    }

    public String upload(List<MultipartFile> files) throws IOException {
        for(int i=0; i<files.size(); i++){
            String fileName = makeRandomNumber();
            s3Client.putObject(new PutObjectRequest(bucket, fileName, files.get(i).getInputStream(), null)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        }
        return s3Client.getUrl(bucket, files.toString()).toString();
    }


    public String makeRandomNumber(){
        Random random = new Random();

        SimpleDateFormat format1 = new SimpleDateFormat( "yyyyMMddHHmmss");
        Date time = new Date();
        String time1 = format1.format(time);

        String randomNumber = String.valueOf(random.nextInt(99)+10);
        String lastNumber = time1.concat(randomNumber);
        return lastNumber;
    }

}
