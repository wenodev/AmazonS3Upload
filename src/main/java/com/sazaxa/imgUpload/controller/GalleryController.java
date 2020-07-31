package com.sazaxa.imgUpload.controller;

import com.sazaxa.imgUpload.dto.GalleryDto;
import com.sazaxa.imgUpload.service.GalleryService;
import com.sazaxa.imgUpload.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@Controller
public class GalleryController {

    private S3Service s3Service;
    private GalleryService galleryService;

    @GetMapping("/gallery")
    public String galleryPage(){
        return "/gallery";
    }

    @PostMapping("/gallery")
    public String execWrite(GalleryDto galleryDto, List<MultipartFile> files) throws IOException {

        String imgPath = s3Service.upload(files);

        galleryDto.setFilePath(imgPath);

        galleryService.savePost(galleryDto);

        return "redirect:/gallery";
    }





}