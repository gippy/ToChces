<h2 class="accent pad-t-m" ng-show="!box.confirmMessage">
    <span ng-if="box.id">Upravit nebo smazat stávající seznam</span>
    <span ng-if="!box.id">Vytváříte nový seznam.</span>
</h2>

<div class="mrg-t-m" ng-show="!box.confirmMessage">
    <div class="inline-field">
        <label for="boxName">název</label>
        <input type="text" id="boxName" ng-model="box.name" required />
    </div>
    <div class="inline-field">
        <label>barva</label>
        <div class="colors">
            <span class="dark-red" ng-class="box.color == 'dark-red' ? 'active': ''" ng-click="box.color='dark-red'"></span>
            <span class="red" ng-class="box.color == 'red' ? 'active': ''" ng-click="box.color='red'"></span>
            <span class="brown" ng-class="box.color == 'brown' ? 'active': ''" ng-click="box.color='brown'"></span>
            <span class="orange" ng-class="box.color == 'orange' ? 'active': ''" ng-click="box.color='orange'"></span>
            <span class="yellow" ng-class="box.color == 'yellow' ? 'active': ''" ng-click="box.color='yellow'"></span>
            <span class="light-green" ng-class="box.color == 'light-green' ? 'active': ''" ng-click="box.color='light-green'"></span>
            <span class="green" ng-class="box.color == 'green' ? 'active': ''" ng-click="box.color='green'"></span>
            <span class="light-blue" ng-class="box.color == 'light-blue' ? 'active': ''" ng-click="box.color='light-blue'"></span>
            <span class="blue" ng-class="box.color == 'blue' ? 'active': ''" ng-click="box.color='blue'"></span>
            <span class="purple" ng-class="box.color == 'purple' ? 'active': ''" ng-click="box.color='purple'"></span>
            <span class="pink" ng-class="box.color == 'pink' ? 'active': ''" ng-click="box.color='pink'"></span>
            <span class="light-pink" ng-class="box.color == 'light-pink' ? 'active': ''" ng-click="box.color='light-pink'"></span>
        </div>
    </div>
    <div class="form-checkbox" ng-if="box.id">
        <input type="checkbox" class="small filled" id="boxRemove" ng-model="box.remove" />
        <label for="boxRemove"><span></span> smazat seznam</label>
    </div>
    <div class="form-checkbox" ng-if="box.id">
        <input type="checkbox" class="small filled" id="boxContent" ng-model="box.removeContents" />
        <label for="boxContent"><span></span> smazat obsah seznamu</label>
    </div>
    <button class="mrg-t-s" type="button" ng-click="box.save()">Potvrdit</button>
</div>
<div ng-show="box.confirmMessage">
    <p class="accent mrg-t-m h3"> {{box.confirmMessage}} </p>
    <p class="pad-t-s">
        <button ng-click="box.confirm()">Ano</button>
        <button ng-click="box.cleanConfirmation()" class="red">Ne</button>
    </p>
</div>