<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpaSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_lalu_refresh_tetap_login(): void
    {
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class);

        $user = User::factory()->create();

        // Login seperti SPA (axios): POST /login
        $login = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'password', // password default UserFactory
        ]);
        $login->assertOk()->assertJsonPath('user.email', $user->email);

        // "Refresh halaman": request baru ke /api/user dengan cookie sesi yang sama
        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('email', $user->email)
            ->assertJsonPath('is_admin', false);
    }

    public function test_login_ulang_tanpa_logout_dulu(): void
    {
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class);

        $a = User::factory()->create();
        $b = User::factory()->create();

        $this->postJson('/login', ['email' => $a->email, 'password' => 'password'])->assertOk();
        // Langsung login sebagai akun lain (ganti akun demo -> admin)
        $this->postJson('/login', ['email' => $b->email, 'password' => 'password'])
            ->assertOk()
            ->assertJsonPath('user.email', $b->email);
        $this->getJson('/api/user')->assertOk()->assertJsonPath('email', $b->email);
    }
}
