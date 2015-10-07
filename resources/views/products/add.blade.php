@extends('../app')

@section('message')
    <div class="message empty"></div>
@endsection

@section('content')
    <div class="narrow pad-t-l" ng-controller="AddProductController">
        <div class="steps">
            <p class="status">krok {{step}} ze 4</p>
            <img class="step-dot" ng-class="step >= 1 ? 'active' : ''" ng-src="./images/ball-{{step >= 1 ? 'blue' : 'white'}}.png" ng-click="step = step > 1 ? 1 : step"/>
            <img class="step-dash"  ng-src="./images/arrow-{{step >= 2 ? 'black': 'white'}}.png" />
            <img class="step-dot" ng-class="step >= 2 ? 'active' : ''" ng-src="./images/ball-{{step >= 2 ? 'blue' : 'white'}}.png" ng-click="step = step > 2 ? 2 : step"/>
            <img class="step-dash" ng-src="./images/arrow-{{step >= 3 ? 'black': 'white'}}.png" />
            <img class="step-dot" ng-class="step >= 3 ? 'active' : ''" ng-src="./images/ball-{{step >= 3 ? 'blue' : 'white'}}.png" ng-click="step = step > 3 ? 3 : step"/>
            <img class="step-dash" ng-src="./images/arrow-{{step >= 4 ? 'black': 'white'}}.png" />
            <img class="step-dot" ng-class="step >= 4 ? 'active' : ''" ng-src="./images/ball-{{step >= 4 ? 'blue' : 'white'}}.png" ng-click="step = step > 4 ? 4 : step"/>
        </div>

        <div class="url input-group big" ng-show="step == 1">
            <div ng-show="!loadingImages">
                <input type="text" ng-model="url" placeholder="Zde vložte odkaz na produkt"/>
                <button ng-click="getProduct()">Přidat</button>
            </div>
            <div style="text-align: center;" ng-show="loadingImages">
                <img src="{! URL::asset('images/to-loader.gif') !}" style="height: 100px;" alt="loading data"/>
            </div>
        </div>

        <div class="select-image" ng-if="product.images" ng-show="step == 2">
            <label class="h2 pad-b-s" style="text-align: center;">
                <span>vyberte fotku produktu</span>
            </label>
            <div class="product-images">
                <div class="slide" ng-repeat="image in product.images | orderBy:sizeAndType" ng-class="image.class">
                    <img ng-model="image" ng-class="image.class" ng-src="{{image.src}}" ng-click="getImage(image)" product-image-option />
                </div>
                <div class="slide file">
                    <span class="btn-file">
                        <span>nahrajte vlastní <i class="fa fa-photo"></i></span>
                        <input type="file" file-field />
                    </span>
                </div>
            </div>
        </div>

        <div class="selected-image" ng-show="step == 3" style="text-align:center;">
            <label class="h2" style="text-align: center;">ořízněte fotku na formát</label>
            <div class="crop-options mrg-t-s" ng-class="product.selectedImage.type">
                <button class="crop-type" ng-click="product.selectedImage.type = 'landscape'">
                    <span>na šířku</span>
                    <img src="{! URL::asset('images/crop-style-landscape.png') !}" alt="landscape" />
                </button>
                <button class="crop-type portrait" ng-click="product.selectedImage.type = 'portrait'">
                    <span>na výšku</span>
                    <img src="{! URL::asset('images/crop-style-portrait.png') !}" alt="portrait" />
                </button>
                <button class="crop-type square" ng-click="product.selectedImage.type = 'square'">
                    <span>čtverec</span>
                    <img src="{! URL::asset('images/crop-style-square.png') !}" alt="square" />
                </button>
            </div>
            <div class="crop-area" ng-class="image.class">
                <div class="crop" img-crop image="product.selectedImage.ourSrc" area-type="{{product.selectedImage.type}}" result-image="product.croppedImage" result-image-size="286">
                    &nbsp;
                </div>
            </div>
            <button ng-if="product.croppedImage" type="button" class="button" ng-click="finishCropping()">pokračovat</button>
        </div>

        <div class="data mrg-b-m" ng-show="step == 4">
            <label class="h2" style="text-align: center;">doplňte zbývající údaje</label>
            <div class="add-product-form">
                <div class="mrg-t-s">
                    <label for="name">název produktu</label>
                    <input type="text" id="name" ng-model="product.name" required/>
                </div>
                <div class="mrg-t-s">
                    <label for="vendor">výrobce</label>
                    <input type="text" id="vendor" ng-model="product.vendor" required />
                </div>
                <div class="mrg-t-s">
                    <label for="price">cena</label>
                    <input type="text" id="price" class="half" ng-model="product.price" placeholder="Kč" required />
                </div>
                <div class="mrg-t-s">
                    <label for="description">popis produktu</label>
                    <textarea id="description" ng-model="product.description"></textarea>
                </div>
                <div class="clearfix mrg-t-s">
                    <label>zvolte kategorie</label>
                    <div ng-repeat="category in $parent.categories" class="form-checkbox half">
                        <input type="checkbox" class="small" id="category_{{category.id}}" ng-model="product.categories[category.id]" />
                        <label for="category_{{category.id}}"><span></span> {{category.name}}</label>
                    </div>
                </div>
                <div class="clearfix mrg-t-m">
                    <div class="form-checkbox half">
                        <input type="checkbox" class="small filled" id="truthful" ng-model="product.truthful" />
                        <label for="truthful"><span></span> údaje jsou pravdivé</label>
                    </div>
                    <button type="button" style="float:right;" ng-click="submit()"  ng-show="product.name && product.vendor && product.price && product.truthful">Přidat</button>
                </div>
            </div>
        </div>
        <div class="mrg-b-m center-text">

        </div>
    </div>
@endsection