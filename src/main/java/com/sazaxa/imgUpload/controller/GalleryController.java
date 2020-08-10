package com.sazaxa.imgUpload.controller;

import com.sazaxa.imgUpload.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@Controller
public class GalleryController {

    private S3Service s3Service;

    @GetMapping("/")
    public String hello(){
        return "hello";
    }

    @GetMapping("/gallery")
    public String galleryPage(){
        return "gallery";
    }

    @PostMapping("/gallery")
    public String execWrite(@RequestParam("upload-file") List<MultipartFile> files) throws IOException {
        s3Service.upload(files);
        return "redirect:/gallery";
    }
}
