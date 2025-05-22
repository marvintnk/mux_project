<script>
    import {
        Search,
        CircleUserRound,
        LogOut,
        Settings,
        Store,
        BookHeart,
        UserRoundPlus,
        LogIn
    } from "@lucide/svelte";

    export let profileData = null;
</script>

<div class="navbar bg-base-100 shadow-sm">
    <div class="flex w-full">
        <div class="flex-1 justify-start">
            <a class="btn btn-ghost text-xl">Swapbox</a>
        </div>

        <div class="flex-3 justify-center invisible md:visible">
            <div class="flex place-content-center">
                <div class="mt-1 input input-sm input-bordered min-w-3/4">
                    <div class="mr-1">
                        <Search size={16}/>
                    </div>
                    <input type="text" placeholder="Suche" />
                </div>
            </div>
        </div>

        <div class="flex-1 justify-end">
            <div class="flex place-content-end dropdown dropdown-end mr-2">
                <div class="indicator">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full">
                        {#if profileData === null}
                            <div class="flex place-content-center m-auto">
                                <CircleUserRound size={38}/>
                            </div>
                        {:else}
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        {/if}
                        </div>
                    </div>
                    {#if profileData}
                        <span class="badge badge-accent badge-sm shadow-sm indicator-item">
                            4
                        </span>
                    {/if}
                </div>

                <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 md:w-52 w-32 p-2 shadow"
                >
                    {#if profileData === null}
                        <li>
                            <a>
                                <LogIn size={12}/>
                                Login
                            </a>
                        </li>
                        <li>
                            <a>
                                <UserRoundPlus size={12} />
                                Register
                            </a>
                        </li>
                    {:else}
                        <li>
                            <a>
                                <Store size={12}/>
                                Meine Angebote
                                <span class="badge badge-accent badge-xs mr-2">1</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <BookHeart size={12}/>
                                Meine Favoriten
                                <span class="badge badge-accent badge-xs mr-2">3</span>
                            </a>
                        </li>
                        <li class="border-1"></li>
                        <li>
                            <a>
                                <Settings size={12}/>
                                Einstellungen
                            </a>
                        </li>
                        <li class="flex">
                            <a>
                                <LogOut size={12}/>
                                Abmelden
                            </a>
                        </li>
                    {/if}
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="visible md:invisible mx-4 mt-1">
    <div class="flex place-content-center">
        <div class="mt-1 input input-sm input-bordered min-w-3/4">
            <div class="mr-1">
                <Search size={16}/>
            </div>
            <input type="text" placeholder="Suche" />
        </div>
    </div>
</div>
