<div class="logo">
    <img src="{! URL::asset('images/logo.png') !}" width="115" height="100" alt="To Chcete"/>
</div>

<h2 class="accent pad-t-m">Přihlaste se k ToChcete<br />a vstupte do světa plného inspirace</h2>

<div class="mrg-t-m">

    <div class="inline-field">
        <label>Váše jméno</label>
        <input type="text" ng-model="register.name" required />
    </div>

    <div class="inline-field">
        <label>Váš email</label>
        <input type="email" ng-model="register.email" required />
    </div>

    <div class="inline-field">
        <label>Vaše heslo</label>
        <input type="password" ng-model="register.password" required />
    </div>

    <div class="inline-field">
        <label>Heslo znovu</label>
        <input type="password" ng-model="register.confirmation" required />
    </div>

    <button class="mrg-t-s" type="button" ng-click="register.submit()">Zaregistrovat se</button>

</div>

<p class="mrg-t-l pad-b-xs">Přihlášením souhlasíte s <a href="/terms" target="_blank">podmínkami</a></p>