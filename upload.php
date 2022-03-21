<?php

    header("Access-Control-Allow-Origin: *");

    class Upload{

        private $valid_extensions = array("jpg","jpeg","png");

        public function changeName($name, $oldname, $targetFolder) {
            rename(__DIR__ . "/products/" . $targetFolder . "/" . $oldname, __DIR__ . "/products/" . $targetFolder . "/" . $name);
        }

        public function getImages($targetFolder) {

            $currentImages = array();
            $counter = 0;

            $files = array_diff(scandir(__DIR__ . "/products/" . $targetFolder), array('..', '.'));
            
            foreach($files as $file){

                $currentImages[$counter] = array();

                $currentImages[$counter]["name"] = $file;
                $currentImages[$counter]["folder"] = $targetFolder;
                $currentImages[$counter]["src"] = "***/products/" . $targetFolder . "/" . $file;

                $counter++;

            }

            echo json_encode($currentImages);

        }

        public function deleteImage($filename, $folder) {

            unlink(__DIR__ . "/products/" . $folder . "/" . $filename);

            if(file_exists(__DIR__ . "/products/" . $folder . "/" . $filename)){
                echo 0;
            }else{
                echo 1;
            }

        }

        public function uploadFile($files, $targetFolder) {

            if(!is_dir(__DIR__ . "/products/" . $targetFolder)){
                mkdir(__DIR__ . "/products/" . $targetFolder, 0777, true);
            }

            foreach ($files as $key => $file) {

                $path = $file["name"];
                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                $filename = pathinfo($path, PATHINFO_FILENAME);

                if(in_array(strtolower($ext), $this->valid_extensions)) {
                    
                    $fileImage = __DIR__ . "/products/" . $targetFolder . "/" . $filename . "." . $ext;

                    if(move_uploaded_file($file["tmp_name"], $fileImage)){
                        echo json_encode(array("***/products/" . $targetFolder . "/" . $filename . "." . $ext));
                    }

                }

            }

        }

    }

    $upload = new Upload();

    if(isset($_FILES) && isset($_POST["folder"])){
        $upload->uploadFile($_FILES, $_POST["folder"]);
    }

    if(isset($_POST["filename"]) && isset($_POST["folder"]) && isset($_POST["deleteImage"])){
        $upload->deleteImage($_POST["filename"], $_POST["folder"]);
    }

    if(isset($_POST["folder"]) && isset($_POST["getImages"])){
        $upload->getImages($_POST["folder"]);
    }

    if(isset($_POST["name"]) && isset($_POST["oldname"]) && isset($_POST["folder"]) && isset($_POST["changeName"])){
        $upload->changeName($_POST["name"], $_POST["oldname"], $_POST["folder"]);
    }

?>
