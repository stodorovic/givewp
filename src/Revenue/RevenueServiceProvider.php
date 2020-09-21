<?php

namespace Give\Revenue;

use Give\Framework\Migrations\MigrationsRegister;
use Give\Revenue\Migrations\CreateRevenueTable;
use Give\ServiceProviders\ServiceProvider;

class RevenueServiceProvider implements ServiceProvider {
	/**
	 * @inheritDoc
	 *
	 * @since 2.9.0
	 */
	public function register() {
	}

	/**
	 * @inheritDoc
	 *
	 * @since 2.9.0
	 */
	public function boot() {
		$this->registerMigrations();
	}

	/**
	 * Registers database migrations with the MigrationsRunner
	 */
	private function registerMigrations() {
		/** @var MigrationsRegister $register */
		$register = give( MigrationsRegister::class );

		$register->addMigration( CreateRevenueTable::class );
	}
}
