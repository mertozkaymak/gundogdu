(function(){

    let uploadedCounter;
    uploadedCounter = 0;

    let imageOldName;
    imageOldName = "";

    let spinner;
    spinner = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

    async function asyncForEach(array, callback) {

        for (let index = 0; index < Object.keys(array).length; index++) {

            await callback(array[index], index, array);

        }

    }

    function activated(){

        let active;
        active = false;

        let page;
        page = window.location.href;

        if(page.indexOf("/product/edit") !== -1){

            if($("#EditProductForm .defaultTab .tabHead .tabHead-selected").text().indexOf("Diğer") !== -1){
                active = true;
            }
            
        }

        return active;

    }

    function generateUploadButton(){

        let target;
        target = $("#EditProductForm .tabContent [data-selector='product-image1-rel']").parents(".formRow:eq(0)");

        if(target.parent().find("#uploadImages").length !== 0){
            return false;
        }

        target.before(`<div class="formRow" id="uploadImages">
            <label>
                Resim Yükleme Alanı
            </label>
            <div class="colon">:</div>
            <input type="button" value="Yeni Resim Yükle" data-selector="upload" class="blueButton buttonLarge fleft tabContentNextButton">
            <input type="button" value="Mevcut Resimleri Düzenle" data-selector="edit" class="grayButton buttonLarge fleft tabContentNextButton">
        </div>`);

    }

    function moveButtonController(){

        let counter;
        counter = 0;

        if($(".swal2-popup #uploadedImages tr, .swal2-popup #list-of-images tr").length === 0){
            return false;
        }

        $(".swal2-popup #uploadedImages, .swal2-popup #list-of-images").find("tr").each(function(){

            $(this).find(".btn-move-up, .btn-move-down").removeClass("disabled");

            if(counter == 0){
                $(this).find(".btn-move-up").addClass("disabled");
            }

            if(counter !== 0 && counter == $(".swal2-popup #uploadedImages tr, .swal2-popup #list-of-images tr").length - 1){
                $(this).find(".btn-move-down").addClass("disabled");
            }

            counter++;

        });

    }

    function postImageData(image, name, length){

        $.ajax({
            url: "https://sumelabilisim.com/cdn/digitalfikirler/upload.php",
            type: "POST",
            data: image,
            contentType: false,
            processData: false,
            success: function(response){

                response = JSON.parse(response);

                if(response.length !== 0){

                    $(".swal2-popup #uploadedImages table tbody").append(`<tr>
                        <td class="right-cotent"><img src="${ response[0] }" alt="${ name }"/></td>
                        <td class="left-content">
                            <input type="text" class="disabled" value="${ name }" data-folder="${ getProductId() }" />
                            <a href="javascript:void(0)" class="btn btn-delete">Sil</a>
                            <!--<div class="move-buttons">
                                <a href="javascript:void(0)" class="btn btn-move-up">Üste Taşı</a>
                                <a href="javascript:void(0)" class="btn btn-move-down">Alta Taşı</a>
                            </div>-->
                        </td>
                    </tr>`);

                    // moveButtonController();
                    // appendJsonPostController();

                    if($(".swal2-popup .swal2-footer .post-data-buttons").length === 0){
                        $(".swal2-popup .swal2-footer").append(`<div class="post-data-buttons">
                            <a href="javascript:void(0)" class="btn btn-primary" id="btnConfirm">Onayla</a>
                        </div>`);
                    }

                    uploadedCounter++;
                    
                    if(uploadedCounter == length){

                        uploadedCounter = 0;
                        $(".swal2-popup .swal2-footer .loading-bar").remove();
                        $(".swal2-popup .swal2-footer #btnUpload").removeClass("disabled");
                        // $(".swal2-popup .swal2-footer .post-data-buttons .btn").removeClass("disabled");

                    }
                    
                    $(".swal2-popup #uploadFileInput").val("");
                }
                
            }
        });

    }

    function getProductId(){

        let url;
        url = window.location.href;

        let splitUrl;
        splitUrl = url.split("/");

        let productId;
        productId = splitUrl[splitUrl.length - 1];

        return productId;
    }

    function deleteImage(name, folder, target){
        
        $.ajax({
            url: "https://sumelabilisim.com/cdn/digitalfikirler/upload.php",
            type: "POST",
            data: {
                filename: name,
                folder: folder,
                deleteImage: 1
            },
            success: function(response){
                if(response == 1){
                    target.remove();
                }
            }
        });

    }

    function appendJsonPostController(){

        if($(".swal2-popup .swal2-footer .post-data-buttons").length !== 0){
            return false;
        }

        $(".swal2-popup .swal2-footer").append(`<div class="post-data-buttons">
            <!--<a href="javascript:void(0)" class="btn btn-primary" id="btnCancel">Vazgeç</a>-->
            <a href="javascript:void(0)" class="btn btn-primary" id="btnPostData">Kaydet</a>
        </div>`);

    }

    $(document).on("click", ".swal2-footer #btnConfirm", function(){
        $("#EditProductForm .tabContent #uploadImages [data-selector='edit']").trigger("click");
    });
    
    $(document).ready(function(){

        if(activated() !== false){
            generateUploadButton();
        }

    });

    $(document).on("click", "#EditProductForm .defaultTab .tabHead a", function(){

        if(activated() !== false){
            generateUploadButton();
        }

    });

    $(document).on("click", "#EditProductForm .tabContent #uploadImages [data-selector='upload']", function(){

        Swal.fire({
            title: "Resim Yükleme Alanı",
            text: "Lütfen JPG, JPEG veya PNG formatında dosya yükleyiniz.",
            footer: `<form enctype="multipart/form-data" method="POST">
                <input type="file" name="file[]" id="uploadFileInput" multiple/>
                <a href="javascript:void(0)" class="btn btn-primary" id="btnUpload">Yükle</a>
            </form>`,
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: false,
            allowOutsideClick: false
        });

    });

    $(document).on("click", "#EditProductForm .tabContent #uploadImages [data-selector='edit']", function(){

        let folder;
        folder = getProductId();

        $.ajax({
            url: "https://sumelabilisim.com/cdn/digitalfikirler/upload.php",
            type: "POST",
            data: {
                folder: folder,
                getImages: 1
            },
            success: function(response){

                response = JSON.parse(response);

                if(response.length !== 0){

                    let listContent;
                    listContent = `<div id="list-of-images"><table><tbody>`;

                    for (let index = 0; index < response.length; index++) {

                        listContent += `<tr><td class="right-cotent">
                            <img src="${ response[index].src }" alt="${ response[index].name }"/>
                        <td>
                        <td class="left-content">
                            <label>Resim Adı:</label>
                            <input type="text" class="image-name" placeholder="${ response[index].name.split(".")[0].trim() }" data-ext="${ response[index].name.split(".")[1].trim() }" data-folder="${ response[index].folder }" />
                            <a href="javascript:void(0)" class="btn btn-delete">Sil</a>
                            <div class="move-buttons">
                                <a href="javascript:void(0)" class="btn btn-move-up">Üste Taşı</a>
                                <a href="javascript:void(0)" class="btn btn-move-down">Alta Taşı</a>
                            </div>
                        </td></tr>`;

                    }

                    listContent += `</tbody></table></div>`;

                    Swal.fire({
                        title: "Resim Düzenleme Alanı",
                        text: "Ürün resimleri aşağıda görüntülenmektedir.",
                        footer: listContent,
                        showConfirmButton: false,
                        showCancelButton: false,
                        showCloseButton: false,
                        allowOutsideClick: false
                    });

                    moveButtonController();
                    appendJsonPostController();

                }else{

                    swal.fire({
                        icon: "warning",
                        title: "Görsel Bulunamadı!",
                        text: "En az bir görsel yüklemeniz gerekmektedir.",
                        confirmButtonText: "Tamam",
                        onClose: function(){
                            swal.close();
                        }
                    });

                }

            }
        });

    });

    $(document).on("change", ".swal2-popup #uploadFileInput", function(){

        let formData;
        formData = new FormData();

        let files;
        files = $(".swal2-popup #uploadFileInput")[0].files;

        let targetFolder;
        targetFolder = getProductId();

        if(files.length === 0 || typeof targetFolder === "undefined"){
            return false;
        }

        if($(this).parents(".swal2-footer").find(".loading-bar").length === 0){
            $(this).parents(".swal2-footer").append(`<div class="loading-bar"></div>`);
            $(this).parents(".swal2-footer").find(".loading-bar").append($(spinner));
        }

        // $(this).parent().find("#btnUpload").addClass("disabled");

        if($(this).parents(".swal2-footer").find("#uploadedImages").length === 0){
            $(this).parents(".swal2-footer").append(`<div id="uploadedImages">
                <table>
                    <tbody></tbody>
                </table>
            </div>`);
        }

        for (let index = 0; index < files.length; index++) {

            formData.append("file", files[index]);
            formData.append("folder", targetFolder);
            postImageData(formData, files[index].name, files.length);

        }

    });

    $(document).on("click", ".swal2-popup #btnUpload", function(){
        $(this).parent().find("input").trigger("click");
    });

    $(document).on("click", ".swal2-popup .left-content .move-buttons .btn-move-down", function(){

        let clone;
        clone = $(this).parents("tr:eq(0)").clone();

        let target;
        target = $(this).parents("tr:eq(0)").next();

        if(target.length === 0){
            $(this).addClass("disabled");
            return false;
        }

        target.after($(clone));
        $(this).parents("tr:eq(0)").remove();

        moveButtonController();

    });

    $(document).on("click", ".swal2-popup .left-content .move-buttons .btn-move-up", function(){

        let clone;
        clone = $(this).parents("tr:eq(0)").clone();

        let target;
        target = $(this).parents("tr:eq(0)").prev();

        if(target.length === 0){
            $(this).addClass("disabled");
            return false;
        }

        target.before($(clone));
        $(this).parents("tr:eq(0)").remove();

        moveButtonController();

    });

    $(document).on("click", ".swal2-popup #uploadedImages .left-content .btn-delete", function(){

        let target;
        target = $(this).parents("tr:eq(0)");

        let target2;
        target2 = $(this).parent().find("input");

        let fileName;
        fileName = target2.val();

        let folder;
        folder = target2.attr("data-folder");

        deleteImage(fileName, folder, target);

    });

    $(document).on("click", ".swal2-popup #list-of-images .left-content .btn-delete", function(){

        let target;
        target = $(this).parents("tr:eq(0)");

        let target2;
        target2 = $(this).parent().find(".image-name");

        let name;
        name = target2.attr("placeholder");

        let ext;
        ext = target2.attr("data-ext");

        let fullname;
        fullname = name + "." + ext;

        let folder;
        folder = target2.attr("data-folder");

        deleteImage(fullname, folder, target);

    });

    $(document).on("click", ".swal2-popup .post-data-buttons #btnPostData", function(){

        let data;

        let postData;
        postData = new Array();

        let productId;
        productId = getProductId();

        $(this).parents(".swal2-footer").find("#uploadedImages table tbody tr, #list-of-images table tbody tr").each(function(){
            
            data = new Object();
            data.src = "https://sumelabilisim.com/cdn/digitalfikirler/products/" + $(this).find(".left-content input").attr("data-folder") + "/" + `${($(this).find(".left-content input").val() !== "") ? $(this).find(".left-content input").val() : $(this).find(".left-content input").attr("placeholder")}` + "." + $(this).find(".left-content input").attr("data-ext");

            if(data.src.indexOf(".undefined") !== -1){
                data.src = data.src.replace(".undefined", "");
            }

            postData.push(data);

        });
        
        if(postData.length === 0){
            postData = "";
        }

        $.ajax({
            url: "https://sumelabilisim.com/cdn/digitalfikirler/datalayer.php",
            type: "POST",
            data: {
                id: productId,
                images: postData
            },
            success: function(response){

                if(response === "1"){

                    swal.fire({
                        icon: "success",
                        title: "Başarılı!",
                        text: "Görselleriniz başarılı bir şekilde kaydedilmiştir.",
                        confirmButtonText: "Tamam",
                        onClose: function(){
                            swal.close();
                        }
                    });

                }

            }
        });

    });

    $(document).on("click", ".swal2-popup .post-data-buttons #btnCancel", async function(){

        let name;
        name = "";

        let folder;
        folder = "";

        let target;
        target = $(this).parents(".swal2-footer").find("#uploadedImages table tbody tr");

        if($(this).parents("#uploadedImages").length === 0){
            swal.close();
            return false;
        }

        await asyncForEach(target, function(obj){
            
            setTimeout(function(){

                name = $(obj).find(".left-content input").val();
                folder = $(obj).find(".left-content input").attr("data-folder");

                deleteImage(name, folder, $(obj));
                $(obj).find(".left-content .btn-delete").trigger("click");

            }, 1500);

        });

        swal.close();

    });

    $(document).on("focus", ".swal2-popup #list-of-images input", function(){
        imageOldName = $(this).attr("placeholder") + "." + $(this).attr("data-ext");
    });

    $(document).on("input", ".swal2-popup #list-of-images input", function(){
        $(this).parent().find(".err-info").remove();
    });
    
    $(document).on("change", ".swal2-popup #list-of-images input", function(){

        let name;
        name = $(this).val();

        let ext;
        ext = $(this).attr("data-ext");

        let fullname;
        fullname = name + "." + ext;

        let folder;
        folder = $(this).attr("data-folder");

        let self;
        self = $(this);

        $.ajax({
            url: "https://sumelabilisim.com/cdn/digitalfikirler/upload.php",
            type: "POST",
            data: {
                name: fullname,
                oldname: imageOldName,
                folder: folder,
                changeName: 1
            }
        });

    });

})(jQuery);