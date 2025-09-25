<script>
    import { onMount, onDestroy } from 'svelte';
    import Icon from "@iconify/svelte";
    import { Block, Link, Navbar, NavRight, Page, Popup } from "framework7-svelte";
    import { PATIENT_DATA } from "@/js/store/user";
    import { formatDateExt, generateSVGAvatar } from "@/js/utils";
    import { io } from 'socket.io-client';
    import {PB} from "@/js/pb";

    export let appointment;
    $: userId = $PATIENT_DATA?.id;


    let loading = false;
    let messages = [];
    let messageInput = '';
    let connectionStatus = 'Disconnected';    async function sendChatMessage() {
        try {
            const chat = await PB.collection('chats').create({
                message: messageInput,
                sender: $PATIENT_DATA?.id,
                appointment_id: appointment?.id
            });
            messageInput = '';
            console.log('Chat message sent:', chat);
        } catch (error) {
            console.error(error);
        }
    }

    async function getMessages() {
        loading = true;
        try {
            messages = await PB.collection('chats').getFullList({
                filter: `appointment_id='${appointment?.id}'`,
            });
            connectionStatus = 'Connected'
            console.log('Messages:', messages);
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

    onMount(async () => {
        await getMessages();
        await PB.collection('chats').subscribe('*', () => {
            getMessages();
        });

        await PB.collection('fcm_users').create({
            appointment_id: appointment?.id,
            fcm_token: localStorage.getItem('fcm_token'),
        });
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
                                Me • {formatDateExt(message.created)}
                            </p>
                        </div>
                        <span class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full overflow-hidden bg-gray-600">
                            <img src={generateSVGAvatar($PATIENT_DATA?.email)} alt="">
                        </span>
                    </li>
                {:else}
                    <li class="max-w-2xl mr-auto flex justify-start gap-x-2 sm:gap-x-4">
                          <span class="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full overflow-hidden bg-gray-600">
                              <img src={generateSVGAvatar("Doctor")} alt="">
                          </span>
                        <div class="grow  max-w-sm">
                            <div class="inline-block bg-white rounded-lg p-3 shadow-sm">
                                <p class="text-xs text-gray-800">{@html message.message}</p>
                            </div>
                            <p class="text-xs text-gray-400 mt-1">
                                Doctor • {formatDateExt(message.created)}
                            </p>
                        </div>
                    </li>
                {/if}
            {/each}
        </ul>

        <div class="absolute !z-[9999] left-1/2 bottom-0 transform -translate-x-1/2 w-full">
            <div class="bg-white flex items-center gap-3 w-full pt-2 pb-5 px-2 shadow-sm">
                <input
                        type="text"
                        class="placeholder:text-base"
                        bind:value={messageInput}
                        on:keypress={(e) => e.key === 'Enter' && sendChatMessage()}
                        placeholder="Type a message..."
                />
                <button disabled={!messageInput} on:click={sendChatMessage} class="!w-auto">
                    <Icon icon="fluent:send-32-filled" class="w-10 h-10 text-primary-600"/>
                </button>
            </div>

        </div>


    </Page>
</Popup>
