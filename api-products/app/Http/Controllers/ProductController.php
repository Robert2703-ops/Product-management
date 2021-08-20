<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET
    public function showAll(int $id = -1) {
        if ( $id > -1 ) {
            $response = [
                'product' => Product::all()->where('id', $id)
            ];
            
            return response($response, 200);
        }

        $response = [
            'products' => Product::all()
        ];

        return response($response, 200);
    }

    // POST
    public function createProduct(Request $request) {
        $data = $request->validate([
            'name' => 'required|unique:products,name|max:200',
            'category' => 'required|max:200',
            'quantity' => 'required'
        ]);

        Product::create($data);

        $response = [
            'status' => true,
            'message' => "Product created!"
        ];

        return response($response, 201);
    } 

    // PUT
    public function changeProduct(Request $request, int $id) {
        $data = $request->validate([
            'name' => 'required|max:200',
            'category' => 'required|max:200',
            'quantity' => 'required'
        ]);

        Product::where('id', $id) ->update($data);

        $response = [
            'status' => true,
            'message' => "Product changed!"
        ];

        return response($response, 200);
    }

    // DELETE
    public function deleteProduct (int $id) {
        Product::where('id', $id)->delete();

        $response = [
            'status' => true,
            'message' => "Product deleted!"
        ];

        return response($response, 200);
    }
}
