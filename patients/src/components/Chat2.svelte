<script>
    import {onMount, onDestroy} from 'svelte';
    import Icon from "@iconify/svelte";
    import {Block, Link, Navbar, NavRight, Page, Popup} from "framework7-svelte";
    import {PATIENT_DATA} from "@/js/store/user";
    import {formatDateExt, generateSVGAvatar} from "@/js/utils";

    export let appointment;
    $: userId = $PATIENT_DATA?.id;


    let ws;
    let messages = [];
    let messageInput = '';
    let connectionStatus = 'Disconnected';

    $: connectionString = `ws://localhost:3000/ws?appointmentId=${appointment.id}&userId=${$PATIENT_DATA?.id}`;

    function connectWebSocket() {
        console.log(`Attempting to connect to WebSocket: ${connectionString}`);
        ws = new WebSocket(connectionString);

        ws.onopen = () => {
            console.log('WebSocket connected');
            connectionStatus = 'Connected';
        };

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'past_messages') {
                    messages = data.messages;
                    console.log('Received past messages:', messages);
                } else if (data.type === 'new_message') {
                    messages = [...messages, data];
                    console.log('Received new message:', data);
                }
                console.log('Updated messages:', messages);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected:', event);
            connectionStatus = 'Disconnected';
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            connectionStatus = 'Error';
        };
    }

    function sendMessage() {
        if (messageInput.trim() && ws.readyState === WebSocket.OPEN) {
            const message = {message: messageInput};
            console.log('Sending message:', message);
            ws.send(JSON.stringify(message));
            messageInput = '';
        }
    }

    onMount(() => {
        connectWebSocket();
    });

    onDestroy(() => {
        if (ws) {
            console.log('Closing WebSocket connection');
            ws.close();
        }
    });
</script>
<Popup class="chat">
    <Page>
        <Navbar title="Chat" class="custom-navbar print:hidden">
            <NavRight>
                <Link popupClose>
                    <Icon icon="heroicons:x-mark-20-solid" class="h-8 w-8 text-zinc-800"/>
                </Link>
            </NavRight>
        </Navbar>

        <div class="flex justify-center pb-2 border-b border-zinc-100 shadow">
            {#if connectionStatus === 'Connected'}
                <div class="item-title !text-xs flex items-center gap-2 pl-1">
                                <span class="relative flex h-2 w-2 overflow-visible">
                                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 "></span>
                                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                    <span>Connected</span>
                </div>
            {:else}
                <div class="item-title !text-xs flex items-center gap-2 pl-1">
                                <span class="relative flex h-2 w-2 overflow-visible">
                                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 "></span>
                                  <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                    <span>Disconnected</span>
                </div>
            {/if}
        </div>
        <ul class="overflow-y-auto h-[80vh] px-5 pb-6 pt-3 bg-[url('/img/bg.webp')] bg-cover bg-fixed bg-no-repeat space-y-3">
            <li class="text-center text-[0.7rem] bg-zinc-50 italic rounded-full px-2 py-1 text-zinc-500">
                Appointment {appointment.id}</li>
            {#each messages as message}
                {#if message.sender === userId || message.sender === undefined}
                    <li class="max-w-2xl ml-auto flex justify-end gap-x-2 sm:gap-x-4">
                        <div class="grow text-end max-w-sm">
                            <div class="inline-block bg-primary-700 rounded-lg p-3 shadow-sm">
                                <p class="text-xs text-white">{@html message.message}</p>
                            </div>
                            <p class="text-xs text-gray-400 mt-1">
                                Me • {formatDateExt(message.timestamp)}
                            </p>
                        </div>

                        <span
                                class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full overflow-hidden bg-gray-600"
                        >
													{@html generateSVGAvatar($PATIENT_DATA?.email)}
												</span>
                    </li>
                {:else}
                    <li class="flex gap-x-2 sm:gap-x-4">
												<span
                                                        class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full overflow-hidden bg-gray-600"
                                                >
													{@html generateSVGAvatar("Doctor")}
												</span>
                        <!-- Card -->
                        <div>
                            <div
                                    class="bg-white border border-gray-200 rounded-lg p-3 space-y-3 dark:bg-slate-900 dark:border-gray-700 max-w-sm"
                            >
                                <div class="space-y-1.5">
                                    <p class="text-xs text-gray-800 dark:text-white">
                                        {@html message.message}
                                    </p>
                                </div>
                            </div>
                            <p class="text-xs text-gray-400 mt-1">
                                Doctor • {formatDateExt(message.timestamp)}
                            </p>
                        </div>

                        <!-- End Card -->
                    </li>
                {/if}
            {/each}
        </ul>

        <div class="absolute !z-[9999] left-1/2 bottom-0 transform -translate-x-1/2 w-full">
            <div class="bg-white flex items-center gap-3 w-full py-1 px-2 shadow-sm">
                <input
                        type="text"
                        class="placeholder:text-base"
                        bind:value={messageInput}
                        on:keypress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                />
                <button disabled={!messageInput} on:click={sendMessage} class="!w-auto">
                    <Icon icon="fluent:send-32-filled" class="w-10 h-10 text-primary-600"/>
                </button>
            </div>

        </div>


    </Page>
</Popup>
