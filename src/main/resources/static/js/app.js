var albumBucketName = 'sazaxa-img-hosting';
var bucketRegion = 'us-east-2';
var IdentityPoolId = 'us-east-2:a7635978-e87c-4a48-9a56-cb1a23d56b43';


AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: albumBucketName
    }
});

function listAlbums() {
    s3.listObjects({
        Delimiter: '/'
    }, function (err, data) {
        if (err) {
            return alert('There was an error listing your albums: ' + err.message);
        } else {
            console.log('앨범', data.CommonPrefixes)
            var albums = data.CommonPrefixes.map(function (commonPrefix) {
                var prefix = commonPrefix.Prefix;
                var albumName = decodeURIComponent(prefix.replace('/', ''));
                return getHtml([
                    '<li>',
                    '<span onclick="deleteAlbum(\'' + albumName + '\')">X</span>',
                    '<span onclick="viewAlbum(\'' + albumName + '\')">',
                    albumName,
                    '</span>',
                    '</li>'
                ]);
            });
            var message = albums.length ?
                getHtml([
                    '<p>Click on an album name to view it.</p>',
                    '<p>Click on the X to delete the album.</p>'
                ]) :
                '<p>You do not have any albums. Please Create album.';
            var htmlTemplate = [
                '<h2>Albums</h2>',
                message,
                '<ul>',
                getHtml(albums),
                '</ul>',
                '<button onclick="createAlbum(prompt(\'Enter Album Name:\'))">',
                'Create New Album',
                '</button>'
            ]
            document.getElementById('app').innerHTML = getHtml(htmlTemplate);
        }
    });
}

function createAlbum(albumName) {
    albumName = albumName.trim();
    if (!albumName) {
        return alert('Album names must contain at least one non-space character.');
    }
    if (albumName.indexOf('/') !== -1) {
        return alert('Album names cannot contain slashes.');
    }
    var albumKey = encodeURIComponent(albumName) + '/';
    s3.headObject({
        Key: albumKey
    }, function (err, data) {
        if (!err) {
            return alert('Album already exists.');
        }
        if (err.code !== 'NotFound') {
            return alert('There was an error creating your album: ' + err.message);
        }
        s3.putObject({
            Key: albumKey
        }, function (err, data) {
            if (err) {
                return alert('There was an error creating your album: ' + err.message);
            }
            alert('Successfully created album.');
            viewAlbum(albumName);
        });
    });
}

function viewAlbum(albumName, callback) {
    albumName = "";
    // var albumPhotosKey = encodeURIComponent(albumName) + '/';
    var albumPhotosKey = encodeURIComponent(albumName);
    s3.listObjects({
        Prefix: albumPhotosKey
    }, function (err, data) {
        if (err) {
            return alert('There was an error viewing your album: ' + err.message);
        }
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + '/';

        photos = data.Contents.map(function (photo) {
            var photoKey = photo.Key;
            var photoUrl = bucketUrl + encodeURIComponent(photoKey);
            return photoUrl;
        });
        photos.reverse()

        var message = photos.length ?
            '<p>Click on the X to delete the photo</p>' :
            '<p>You do not have any photos in this album. Please add photos.</p>';
        return callback(photos);
    });

}

function addPhoto(albumName) {
    var files = document.getElementById('photoupload').files;
    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent(albumName) + '//';

    var photoKey = albumPhotosKey + fileName;
    s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
    }, function (err, data) {
        if (err) {
            console.log(err)
            return alert('There was an error uploading your photo: ', err.message);
        }
        alert('Successfully uploaded photo.');
        viewAlbum(albumName);
    });
}

function deletePhoto(albumName, photoKey) {
    s3.deleteObject({
        Key: photoKey
    }, function (err, data) {
        if (err) {
            return alert('There was an error deleting your photo: ', err.message);
        }
        alert('Successfully deleted photo.');
        viewAlbum(albumName);
    });
}

function deleteAlbum(albumName) {
    var albumKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({
        Prefix: albumKey
    }, function (err, data) {
        if (err) {
            return alert('There was an error deleting your album: ', err.message);
        }
        var objects = data.Contents.map(function (object) {
            return {
                Key: object.Key
            };
        });
        s3.deleteObjects({
            Delete: {
                Objects: objects,
                Quiet: true
            }
        }, function (err, data) {
            if (err) {
                return alert('There was an error deleting your album: ', err.message);
            }
            alert('Successfully deleted album.');
            listAlbums();
        });
    });
}