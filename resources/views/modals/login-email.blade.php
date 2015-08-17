<div class="logo">
    <img src="{! URL::asset('images/logo.png') !}" width="115" height="100" alt="To Chcete"/>
</div>

<h2 class="accent pad-t-m">Přihlaste se k ToChcete<br />a vstupte do světa plného inspirace</h2>

<p class="mrg-t-m">
    <div class="inline-field">
        <label>Váš email</label>
        <input type="email" ng-model="login.email" required />
    </div>
    <div class="inline-field">
        <label>Vaše heslo</label>
        <input type="password" ng-model="login.password" required />
    </div>
    <button class="mrg-t-s" type="button" ng-click="login.submit()">Přihlásit se</button>
</p>

<p class="mrg-t-m pad-b-xs">Ještě nemáte účet na ToChcete? <a href="#" ng-click="open('register')">Zaregistrujte se</a>.</p>

<p class="mrg-t-m pad-b-xs">Přihlášením souhlasíte s <a href="/terms" target="_blank">podmínkami</a></p>