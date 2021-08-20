<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::namespace('Api.')->name('api.')->group(function () {
    Route::prefix('/products')->group(function () {
        Route::get('/{id?}', [ProductController::class, 'showAll'])->name('all-products');
    
        Route::post('/', [ProductController::class, 'createProduct'])->name('create-product');
    
        Route::put('/{id}', [ProductController::class, 'changeProduct'])->name('change-product');
    
        Route::delete('/{id}', [ProductController::class, 'deleteProduct'])->name('delete-product');
    });
});
