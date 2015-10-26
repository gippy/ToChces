<h2 class="accent" ng-show="!boxes.confirmMessage">
    Upravit, sloučit nebo smazat hotové seznamy
</h2>

<div ng-show="!boxes.confirmMessage">

    <div class="mrg-t-m">
        <div class="editable-box" ng-repeat="box in boxes.boxes" drag ng-model="box" top-scope="boxes">
            <img ng-if="box.id != 1 && box.id != 2"
                 class="edit" src="{! URL::asset('images/pencil-white.png') !}"
                 alt="landscape"
                 ng-click="boxes.showEdit(box)"
            /><div class="box" ng-class="box.color + ' corner'" drop ng-model="box" top-scope="boxes">
                {{box.name}}
            </div>
        </div>
    </div>

    <p class="accent pad-t-s h3">
        Pro sloučení přetáhněte seznam na ten, který chcete upravit
    </p>
</div>

<div ng-show="boxes.confirmMessage">
    <p class="accent mrg-t-m h3"> {{boxes.confirmMessage}} </p>
    <p class="pad-t-s">
        <button ng-click="boxes.confirm()">Ano</button>
        <button ng-click="boxes.cleanConfirmation()" class="red">Ne</button>
    </p>
</div>