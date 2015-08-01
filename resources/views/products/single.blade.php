@extends('../app')

@section('content')

<div class="wide pad-t-l">
    <div class="product {! $product->type !} clearfix">
        <img src="{! $product->image !}" alt="{! $product->name !}" />
        <div class="info clearfix">
            <p class="name">{! $product->name !} <br /> Od <span>{! $product->vendor !}</span></p>
            <p class="description">{! $product->description !}</p>
            <p class="price">{! $product->price !} Kč</p>
            <p class="icons">
                <a href="/product/{! $product->id !}/own"><img class="tomam icon" src="{! URL::asset('images/to-mam.png')!}"/></a>
                <a href="/product/{! $product->id !}/like"><img class="tochci icon" src="{! URL::asset('images/to-small.png')!}"/></a>
                <a href="{! $product->url !}" target="_blank"><img class="cart icon" src="{! URL::asset('images/cart.png')!}" /></a>
            </p>
        </div>
        <p style="clear:both;" class="h3 pad-t-l clearfix">Diskuze</p>
        <div id="disqus_thread"></div>
        <script type="text/javascript">
            /* * * CONFIGURATION VARIABLES * * */
            var disqus_shortname = 'tochcete';
            var disqus_identifier = '{! $product->id !}';
            var disqus_title = '{! $product->name !} od {! $product->vendor !}';

            /* * * DON'T EDIT BELOW THIS LINE * * */
            (function() {
                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();
        </script>
    </div>
</div>

@endsection