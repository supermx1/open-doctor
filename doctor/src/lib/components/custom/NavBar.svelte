<script>
	import {
		Navbar,
		NavbarBackLink,
		Link,
	} from 'konsta/svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	export let title = "";
	let history = window.history.length > 1 ? window.history : null;
</script>

<Navbar
	{title}
	class="top-0 sticky"
	transparent={true}
	titleClass="!text-zinc-800 !opacity-100"
>
	<Link slot="left" navbar onClick={()=> {
		if(history) {
			history.back();
		} else {
			goto('/');
	}}}>
		<Icon icon="heroicons:arrow-left-20-solid"  class="text-zinc-800 h-6 w-6" />
	</Link>
</Navbar>
