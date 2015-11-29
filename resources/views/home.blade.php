@extends('app')

@section('message')
    <div class="message empty"></div>
@endsection

@section('content')
    <div class="home narrow pad-t-l">
        @include('partials.products')
    </div>
@endsection
