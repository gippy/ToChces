@extends('../app')

@section('message')
    <div class="message">
        Věci, které chcete, jednoduše přetáhněte do svých seznamů, nebo si vytvořte vlastní.
    </div>
@endsection

@section('content')
    <div class="narrow pad-t-l profile">
        <div class="user mrg-b-s" style="margin-left: 9px;">
            <img src="{! $user->image ? $user->image : '/images/avatar.png' !}" alt="{! $user->name !}" class="profile-photo pull-left"/>
            <h1 class="h3 mrg-t-n">{! $user->name !}</h1>
            <p class="h3">
                <a href="{! URL::route('addProduct') !}">Přidat věc</a>
                <span class="accent">&nbsp;|&nbsp;</span>
                <!--<a href="{! URL::route('settings') !}">Nastavení</a>
                <span class="accent">&nbsp;|&nbsp;</span>-->
                <a href="{! URL::route('logout') !}">Odhlásit se</a>
            </p>
        </div>
        <div class="mrg-b-m" ng-controller="BoxesController">
            <div class="boxes" ng-class="(boxes.length < 4 ? 'center ' : ' ') + scrollClass">
                <div ng-repeat="box in boxes"
                     class="box"
                     ng-class="box.color + ' corner ' + ($parent.$parent.activeColor == box.color ? 'active' : '')"
                     ng-click="$parent.$parent.activeColor = $parent.$parent.activeColor == box.color ? null : box.color"
                     drop ng-model="box" top-scope="$parent.draggableProducts">
                    {{box.name}}
                </div>
                <div class="options mrg-t-s">
                    <a href="#" ng-click="addBox()">+ nový seznam</a>
                    <span class="accent">&nbsp;|&nbsp;</span>
                    <a href="#" ng-click="editBoxes()">upravit seznam</a>
                </div>
            </div>
            <div ng-show="scrollClass" class="boxes-placeholder">&nbsp</div>
        </div>
        <div class="products mrg-b-m">
            @include('partials.draggable-products')
        </div>

    </div>
@endsection