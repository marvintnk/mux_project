<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  export let form;

  let loading = false;
</script>

<div class="flex flex-col">
  <div class="mx-auto mt-5">
    <p class="text-xl font-bold">Willkommen zurück</p>
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
        <legend class="fieldset-legend">Login</legend>

        {#if form?.error}
          <div class="alert alert-error mb-4">
            <span>{form.error}</span>
          </div>
        {/if}

        <label class="label">E-Mail</label>
        <input 
          name="email" 
          type="email" 
          class="input" 
          value={form?.email || ''} 
          disabled={loading} 
          required 
        />

        <label class="label">Passwort</label>
        <input 
          name="password" 
          type="password" 
          class="input" 
          disabled={loading} 
          required 
        />

        <a class="mt-5 text-right w-full link link-info" href="/register">
          Noch kein Account?
        </a>
        
        <button 
          type="submit" 
          class="btn btn-outline btn-success" 
          disabled={loading}
        >
          {#if loading}
            <span class="loading loading-dots loading-md"></span>
          {:else}
            Login
          {/if}
        </button>
      </fieldset>
    </form>
  </div>
</div>
