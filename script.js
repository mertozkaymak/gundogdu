(function($){

    $(document).ready(function(){

        let data;

        let accessInıt;
        accessInıt = true;

        // let targetId;
        // targetId = pageParams.product.parentId;
        
        // if(targetId === 0){
        //     targetId = pageParams.product.id;
        // }

        let targetId;
        targetId = pageParams.product.id;

        $.ajax({
            url: "https://sumelabilisim.com/cdn/digitalfikirler/datalayer.php",
            type: "POST",
            data: {
                productId: targetId
            },
            success: function(response){

                if(response.length !== 0){

                    response = JSON.parse(response);
                    console.log(response);

                    if(response == ""){
                        return false;
                    }

                    if($(".product-left .product-image #product-primary-image #primary-image").length !== 0){

                        $(".product-left .product-image #product-primary-image #primary-image").remove();

                        $(".product-left .product-image #product-primary-image").append(`
                            <img id="primary-image" alt="Digital Fikirler - Test Ürünü" src="${ response[0].src }" data-zoom-image="${ response[0].src }">
                        `);

                    }else{

                        $(".product-left .product-image").html(`
                            <div id="product-primary-image">
                                <img id="primary-image" alt="Test" src="${ response[0].src }" data-zoom-image="${ response[0].src }">
                            </div>
                        `);

                    }

                    if($(".product-left #product-thumb-image").length !== 0){

                        $(".product-left #product-thumb-image .thumb-item").each(function(){
                            $(this).remove();
                        });

                        for (let index = 0; index < response.length; index++) {
                            
                            $(".product-left #product-thumb-image").append(`
                                <div class="thumb-item mb-4 mb-md-0">
                                    <a href="#" data-image="${ response[index].src }" data-zoom-image="${ response[index].src }">
                                        <img src="${ response[index].src }" alt="Test">
                                    </a>
                                </div>
                            `);

                        }
                    }else{

                        for (let index = 0; index < response.length; index++) {

                            if(index == 0 && $(".product-left #product-thumb-image").length === 0){
                                $(".product-left .product-image").after(`
                                    <div class="d-flex align-items-center">
                                        <div id="product-thumb-image">
                                            <div class="thumb-item mb-4 mb-md-0">
                                                <a href="#" data-image="${ response[index].src }" data-zoom-image="${ response[index].src }" class="zoomGalleryActive">
                                                    <img src="${ response[index].src }" alt="Test">
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                `);
                            }else{
                                $(".product-left #product-thumb-image").append(`
                                    <div class="thumb-item mb-4 mb-md-0">
                                        <a href="#" data-image="${ response[index].src }" data-zoom-image="${ response[index].src }">
                                            <img src="${ response[index].src }" alt="Test">
                                        </a>
                                    </div>
                                `);
                            }
    
                        }

                    }

                    IdeaTheme.product.init();
                    $(".product-left").parent().addClass("justify-content-center");

                }

            }
        });

    });

})(jQuery);