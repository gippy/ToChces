@extends('../app')

@section('content')
    <div class="narrow pad-t-l" ng-controller="AddProductController">
        <div class="url input-group big">
            <input type="text" ng-model="url" placeholder="Zde vložte odkaz na produkt"/>
            <button ng-click="getProduct()">Přidat</button>
        </div>
        <p></p>
        <div class="horizontal-slider product-images" ng-if="product.images" ng-show="!product.selectedImage">
            <div class="slide" ng-repeat="image in product.images" ng-class="image.class">
                <img ng-model="image" ng-class="image.class" ng-src="{{image.src}}" ng-click="getImage(image)" product-image-option />
            </div>
        </div>
        <div class="selected-image" ng-if="product.selectedImage.ourSrc" style="text-align:center;">
            <div class="crop-area" ng-class="image.class">
                <div class="crop" img-crop image="product.selectedImage.ourSrc" area-type="{{product.selectedImage.type}}" result-image="product.croppedImage" result-image-size="286">
                    &nbsp;
                </div>
            </div>
        </div>
        <div class="data mrg-t-l mrg-b-m" ng-if="product.croppedImage">
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