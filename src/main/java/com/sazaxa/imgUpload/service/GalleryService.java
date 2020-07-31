package com.sazaxa.imgUpload.service;


import com.sazaxa.imgUpload.domain.GalleryRepository;
import com.sazaxa.imgUpload.dto.GalleryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class GalleryService {

    private GalleryRepository galleryRepository;

    public void savePost(GalleryDto galleryDto){
        galleryRepository.save(galleryDto.toEntity());
    }
}
