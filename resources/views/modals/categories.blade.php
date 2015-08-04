<div class="form-checkbox">
    <input type="checkbox" id="all" ng-checked="!hasActiveCategory()"  ng-click="deselectCategories();" ng-attribute-disabled="hasActiveCategory()"/>
    <label for="all"><span></span> vše</label>
</div>

<p>&nbsp;</p>

<div ng-repeat="category in categories" class="form-checkbox">
    <input type="checkbox" id="category_{{category.id}}" ng-model="category.is_active" />
    <label for="category_{{category.id}}"><span></span> {{category.name}}</label>
</div>
<p>&nbsp;</p>
<div class="center-text">
    <button ng-click="saveCategories()">potvrdit</button>
</div>