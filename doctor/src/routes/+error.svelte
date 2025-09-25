<script>
	import { page } from '$app/stores';

	const messages = {
		404: 'The page your were looking for was not found',
		500: 'Internal server error',
		403: 'Forbidden',
		401: 'Unauthorized'
	};


</script>

<div class="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-md text-center">

		<div class="mx-auto h-32 w-32 rounded-full bg-primary/10 p-6" data-id="3">
			<svg data-id="4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
					 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
					 class="h-full w-full text-primary">
				<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
				<circle cx="12" cy="12" r="10"></circle>
			</svg>
		</div>


		<h1 class="mt-4 font-bold tracking-tight text-foreground text-[5rem]">{$page.status}</h1>
		<p class="mt-4 text-muted-foreground">
			{#if $page.status in messages}
				{messages[$page.status]}
			{:else}
				Unknown error
			{/if}
		</p>
		<div class="pt-6">
			<a
				class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				href="/"
			>
				Go back
			</a>
		</div>
	</div>
</div>