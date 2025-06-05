<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class UserModel extends Model
{
    use HasFactory;
    protected $table = 'tb_users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'username',
        'email',
        'role',
        'avatar',
        'password',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}