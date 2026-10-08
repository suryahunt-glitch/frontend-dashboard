<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TokoFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_buka_toko_lalu_muncul_di_my_store(): void
    {
        $user = User::factory()->create();

        // Belum punya toko → 404 null
        $this->actingAs($user)->getJson('/api/my-store')->assertStatus(404);

        // Buka toko
        $res = $this->actingAs($user)->postJson('/api/my-store', [
            'name' => 'Kelontong Berkah',
            'address' => 'Jl. Mawar No. 1',
            'phone' => '08123456789',
        ]);
        $res->assertStatus(201)->assertJsonPath('data.name', 'Kelontong Berkah');

        // Muncul di my-store + terdaftar di tabel stores (dashboard /admin)
        // Pakai instance fresh: actingAs memakai ulang objek yang sama sehingga
        // relasi 'store' yang sempat tercache null harus dibuang.
        $check = $this->actingAs($user->fresh())->getJson('/api/my-store');
        $check->assertOk()->assertJsonPath('data.phone', '08123456789');
        $this->assertDatabaseHas('stores', ['name' => 'Kelontong Berkah', 'user_id' => $user->id]);

        // Satu akun tidak bisa punya dua toko
        $this->actingAs($user->fresh())->postJson('/api/my-store', [
            'name' => 'Toko Kedua',
            'address' => 'Jl. Melati',
        ])->assertStatus(409);

        // Login hanya untuk akun yang ada (register publik ditutup)
        $this->postJson('/register', ['name' => 'X'])->assertStatus(403);
    }
}
