<?php

    header("Access-Control-Allow-Origin: *");

    class DataLayer{

        protected $dbh;
        protected $conInfo = array(
            "HOST" => "localhost",
            "DBNAME" => "***",
            "USER" => "***",
            "PASS" => "***"
        );

        public function __construct($id, $images) {

            $this->connect();

            if($id !== false || $images !== false){

                $result = 1;

                if(count($this->get($id)) > 0){
                    $result = $this->update($id, json_encode($images));
                }else{
                    $result = $this->insert($id, json_encode($images));
                }

                echo $result;

            }

        }

        protected function connect() {
            try {
                $this->dbh = new PDO("mysql:host=" . $this->conInfo["HOST"] . "; dbname=" . $this->conInfo["DBNAME"] . "; charset=utf8;", $this->conInfo["USER"], $this->conInfo["PASS"]);
            } catch (PDOException $ex) {
                $ex->getMessage();
            }
        }

        public function get($id) {

            $stmt = $this->dbh->prepare("SELECT * FROM product_images WHERE iid = ?");
            $stmt->execute(array($id));
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $result;
            
        }

        public function insert($id, $images) {
            try {
                $stmt = $this->dbh->prepare("INSERT INTO product_images (iid, images) VALUES(?, ?)");
                $stmt->execute(array($id, $images));
                return 1;
            } catch (PDOException $ex) {
                return 0;
            }
        }

        public function update($id, $images) {

            try {
                $stmt = $this->dbh->prepare("UPDATE product_images SET images = ? WHERE iid = ?");
                $stmt->execute(array($images, $id));
                return 1;
            } catch (PDOException $ex) {
                return 0;
            }
        }

    }

    if(isset($_POST["id"]) && isset($_POST["images"])){
        new DataLayer($_POST["id"], $_POST["images"]);
    }else if(isset($_POST["productId"])){
        $datalayer = new DataLayer(false, false);
        echo $datalayer->get($_POST["productId"])[0]["images"];
    }else{
        die();
    }

?>
