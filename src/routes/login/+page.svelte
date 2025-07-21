<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import GreenGradientText from '$lib/components/ui/GreenGradientText.svelte';

  export let form;

  let loading = false;
</script>

<div class="flex justify-center mt-15">
    <div class="avatar">
        <div class="w-32">
            <img src="/android-chrome-512x512.png">
        </div>
    </div>
</div>

<GreenGradientText text="Swapbox" additionalClasses="text-4xl font-bold text-center"/>

<div class="flex flex-col">
  <div class="mx-auto mt-5">
    
  </div>

  <div class="m-auto mt-5">
    <form 
      method="POST" 
      action="?/signin"
      use:enhance={() => {
        loading = true;
        return async ({ result, update }) => {
          loading = false;
          await update();
        };
      }}
    >
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend text-xl">Login</legend>

        {#if form?.error}
          <div class="alert alert-error mb-4">
            <span>{form.error}</span>
          </div>
        {/if}

        <input 
          name="email" 
          type="email" 
          class="input" 
          placeholder="E-Mail"
          value={form?.email || ''} 
          disabled={loading} 
          required 
        />


        <input 
          name="password" 
          type="password" 
          class="input mt-2" 
          placeholder="Passwort"
          disabled={loading} 
          required 
        />

        <a class="mt-5 text-right w-full link link-info" href="/register">
          Noch kein Account?
        </a>
        
        <button 
          type="submit" 
          class="btn btn-outline bg-accent text-white" 
          disabled={loading}
        >
          {#if loading}
            <span class="loading loading-dots loading-md"></span>
          {:else}
            <span class="text-white">Login</span>
          {/if}
        </button>

      </fieldset>
    </form>
  </div>
</div>
