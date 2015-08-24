@extends('../app')

@section('content')
    <div class="narrow pad-t-l" ng-controller="AddProductController">
        <div class="url input-group big" ng-show="!product.images">
            <input type="text" ng-model="url" placeholder="Zde vložte odkaz na produkt"/>
            <button ng-click="getProduct()">Přidat</button>
        </div>

        <div class="select-image" ng-if="product.images" ng-show="!product.selectedImage">
            <label class="h2 pad-b-s" style="text-align: center;">
                <span>Vyberte fotku produktu nebo</span>
                <span class="btn-file">
                    <span>nahrajte vlastní <i class="fa fa-photo"></i></span>
                    <input type="file" file-field />
                </span>
            </label>
            <div class="product-images">
                <div class="slide" ng-repeat="image in product.images | orderBy:sizeAndType" ng-class="image.class">
                    <img ng-model="image" ng-class="image.class" ng-src="{{image.src}}" ng-click="getImage(image)" product-image-option />
                </div>
            </div>
        </div>

        <div class="selected-image" ng-if="product.selectedImage.src"  ng-show="!croppFinished" style="text-align:center;">
            <label class="h2" style="text-align: center;">Která část fotky se Vám nejvíce líbí?</label>
            <div class="crop-options mrg-t-s" ng-class="product.selectedImage.type">
                <button class="crop-type landscape" ng-click="product.selectedImage.type = 'landscape'">
                    <i class="fa fa-photo"></i><br />
                    <span>Landscape</span>
                </button>
                <button class="crop-type square" ng-click="product.selectedImage.type = 'square'">
                    <i class="fa fa-square-o"></i><br />
                    <span>Square</span>
                </button>
                <button class="crop-type portrait" ng-click="product.selectedImage.type = 'portrait'">
                    <i class="fa fa-user"></i><br />
                    <span>Portrait</span>
                </button>
            </div>
            <div class="crop-area" ng-class="image.class">
                <div class="crop" img-crop image="product.selectedImage.ourSrc" area-type="{{product.selectedImage.type}}" result-image="product.croppedImage" result-image-size="286">
                    &nbsp;
                </div>
            </div>
            <button ng-if="product.croppedImage" type="button" class="button" ng-click="finishCropping()">Potvrdit výběr</button>
        </div>

        <div class="data mrg-b-m" ng-if="croppFinished">

            <div ng-if="product.finalSrc" class="cropped-image mrg-t-s mrg-b-s">
                <img ng-src="{{product.finalSrc}}" />
            </div>

            <div>
                <label for="name">Název produktu</label>
                <input type="text" id="name" ng-model="product.name" required/>
            </div>
            <div class="mrg-t-m">
                <label for="vendor">Výrobce</label>
                <input type="text" id="vendor" ng-model="product.vendor" required />
            </div>
            <div class="mrg-t-m">
                <label for="price">Cena</label>
                <input type="text" id="price" class="half" ng-model="product.price" placeholder="Kč" required />
            </div>
            <div class="mrg-t-m">
                <label for="description">Popis produktu</label>
                <textarea id="description" ng-model="product.description"></textarea>
            </div>
            <div class="clearfix mrg-t-m">
                <label>Zvolte kategorie</label>
                <div ng-repeat="category in $parent.categories" class="form-checkbox half">
                    <input type="checkbox" id="category_{{category.id}}" ng-model="product.categories[category.id]" />
                    <label for="category_{{category.id}}"><span></span> {{category.name}}</label>
                </div>
            </div>
            <div class="mrg-t-m clearfix">
                <tags-input ng-model="product.tags"></tags-input>
            </div>
        </div>
        <div class="mrg-b-m center-text" ng-if="product.name && product.vendor && product.price">
            <button type="button" ng-click="submit()">Přidat</button>
        </div>
    </div>
@endsection