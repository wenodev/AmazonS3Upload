package com.sazaxa.imgUpload.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryRepository extends JpaRepository<GalleryEntity, Long> {
}
