<div class="products draggable-products mrg-b-m" ng-controller="ProductsController">
    <div class="switch-type-overlay" ng-show="switchType.product" ng-click="switchType.product = null"></div>
    <div class="switch-type-dialog" ng-show="switchType.product" ng-style="switchType.style">
        <div class="header">Změnit seznam</div>
        <div class="content">
            <ul>
                <li ng-repeat="box in boxes" ng-click="switchType.switch(box)">- {{box.name}}</li>
            </ul>
        </div>
    </div>
    <div ng-repeat="product in products | filter:byColor"
         class="product-item"
         show-details
         item="product"
         ng-class="getClasses(product)"
         drag ng-model="product" top-scope="$parent.draggableProducts">
        <img src="{! URL::asset('images/pencil-white.png') !}" class="switch-type" ng-click="switchType.show(product, $event)"/>

        <a ng-href="/product/{{product.id}}">
            <img class="product-image" ng-attr-alt="{{product.name}}" ng-src="{{product.image}}" />
        </a>
        <div class="details @if(!Auth::check()) guest @endif">
            @if(Auth::check())
                <img ng-if="!product.liked" class="to" src="{! URL::asset('images/to-small.png') !}" alt="To Chci" ng-click="iWantThis(product)" />
            @endif
            <a class="name" ng-href="/product/{{product.id}}">{{product.name}}</a>
            <span class="price">{{product.price}} Kč</span>
        </div>
    </div>
    <div style="text-align: center;" ng-show="loadingImages">
        <img src="{! URL::asset('images/to-loader.gif') !}" style="height: 100px;" alt="loading data"/>
    </div>
</div>