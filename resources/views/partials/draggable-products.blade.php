<div class="products mrg-b-m" ng-controller="ProductsController" masonry='{ "transitionDuration" : "0.4s" , "columnWidth": 304, "itemSelector" : ".product-item"}'>
    <div masonry-tile
         ng-repeat="product in products"
         class="product-item"
         show-details
         item="product"
         ng-class="getClasses(product)"
         drag ng-model="product" top-scope="$parent.draggableProducts">

        <a ng-href="/product/{{product.id}}">
            <img class="product-image" ng-attr-alt="{{product.name}}" ng-src="{{product.image}}" />
        </a>
        <div class="details @if(!Auth::check()) guest @endif">
            @if(Auth::check())
                <img ng-if="!product.liked" class="to" src="{! URL::asset('images/to-small.png') !}" alt="To Chci" ng-click="iWantThis(product)" />
            @endif
            <a class="name" ng-href="/product/{{product.id}}">{{product.name}}</a>
            <span class="price">{{product.price}},-</span>
        </div>
    </div>
    <div style="text-align: center;" ng-show="loadingImages">
        <img src="{! URL::asset('images/to-loader.gif') !}" style="height: 100px;" alt="loading data"/>
    </div>
</div>