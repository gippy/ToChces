<div class="products mrg-b-m pad-t-l" ng-controller="ProductsController">
    <div ng-repeat="product in products" class="product-item" show-details item="product"  ng-class="getClasses(product)">

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
</div>