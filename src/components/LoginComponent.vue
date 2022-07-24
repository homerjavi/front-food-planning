<template>
	<q-page class="row justify-center items-center">
		<div class="column q-pa-lg">
			<div class="row">
				<q-card square class="shadow-24" style="min-width: 350px">
					<q-card-section class="bg-primary">
						<h4 class="text-h5 text-white q-my-md">{{ title }}</h4>
					</q-card-section>
					<q-card-section>
						<q-fab color="secondary" @click="switchTypeForm" icon="add" class="absolute" style="top: 0; right: 12px; transform: translateY(-50%)">
							<q-tooltip> Registro de nueva cuenta </q-tooltip>
						</q-fab>
						<q-form ref="form" class="q-px-sm q-pt-xl">
							<q-input
								ref="account"
								v-if="register"
								square
								clearable
								v-model="account"
								type="text"
								lazy-rules
								:rules="[this.required, this.long, this.short]"
								label="Cuenta"
							>
								<template v-slot:prepend>
									<q-icon name="group_add" />
								</template>
							</q-input>
							<q-input
								ref="username"
								v-if="register"
								square
								clearable
								v-model="username"
								type="text"
								lazy-rules
								:rules="[this.required, this.long, this.short]"
								label="Nombre"
							>
								<template v-slot:prepend>
									<q-icon name="person" />
								</template>
							</q-input>
							<q-input
								ref="email"
								square
								clearable
								v-model="email"
								type="email"
								lazy-rules
								:rules="[this.required, this.isEmail, this.short]"
								label="Email"
							>
								<template v-slot:prepend>
									<q-icon name="email" />
								</template>
							</q-input>
							<q-input
								ref="password"
								square
								clearable
								v-model="password"
								:type="passwordFieldType"
								lazy-rules
								:rules="[this.required, this.short]"
								label="Contraseña"
							>
								<template v-slot:prepend>
									<q-icon name="lock" />
								</template>
								<template v-slot:append>
									<q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
								</template>
							</q-input>
							<q-input
								ref="repassword"
								v-if="register"
								square
								clearable
								v-model="repassword"
								:type="passwordFieldType"
								lazy-rules
								:rules="[this.required, this.short, this.diffPassword]"
								label="Repita la contraseña"
							>
								<template v-slot:prepend>
									<q-icon name="lock" />
								</template>
								<template v-slot:append>
									<q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
								</template>
							</q-input>
						</q-form>
					</q-card-section>

					<q-card-actions class="q-px-lg">
						<q-btn unelevated size="lg" color="secondary" @click="submit" class="full-width text-white" :label="btnLabel" />
					</q-card-actions>
					<q-card-section v-if="!register" class="text-center q-pa-sm">
						<p class="text-grey-6">¿Olvidaste tu contraseña?</p>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script>
import { api } from "boot/axios";
import { useStore } from 'vuex'
import { useQuasar } from "quasar";

export default {
	name: "LoginComponent",
	
	data() {
		return {
			$q: useQuasar(),
			title: "Login",
			account: "",
			email: "homerjavi@gmail.com",
			username: "",
			password: "1234",
			repassword: "",
			register: false,
			passwordFieldType: "password",
			btnLabel: "Login",
			visibility: false,
			visibilityIcon: "visibility",
			validForm: false,
			store: useStore(),
		};
	},
	mounted() {

	},

	methods: {
		required(val) {
			return (val && val.length > 0) || "El campo debe estar completado";
		},
		diffPassword(val) {
			const val2 = this.$refs.password.modelValue;
			return (val && val === val2) || "La contraseña no es igual";
		},
		long(val) {
			return (val && val.length <= 80) || "Demasiado largo";
		},
		short(val) {
			return (val && val.length > 3) || "Demasiado corto";
		},
		isEmail(val) {
			const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
			return emailPattern.test(val) || "Email inválido";
		},
		async submit() {
			if ((await this.$refs.form.validate()) === false) {
				return;
			}

			if (this.register) {
				let data = {
					account: this.account,
					name: this.username,
					email: this.email,
					password: this.password,
				};

				await api
					.post(process.env.API + "account", data)
					.then((response) => {
						console.log({response});
						// this.store.commit( 'auth/setUsername', response.data.username );
						// this.store.commit( 'auth/setToken', response.data.token );
						this.store.commit( 'auth/login', {
							username: response.data.username,
							token: response.data.token,
						} );
						this.$router.push('/');
					})
					.catch((error) => {
						console.error(error);
					});
			}
			else{
				let data = {
					email: this.email,
					password: this.password,
				};

				await api
					.post(process.env.API + "auth/login", data)
					.then((response) => {
						if ( response.status == 200 ) {
							this.$q.notify({
								message: 'Bienvenido ' + response.data.username,
								type: "positive",
								position: "top-right",
							});
							this.store.commit( 'auth/setUsername', response.data.username );
							this.store.commit( 'auth/setToken', response.data.token );
							this.$router.push('/') ;
						} else{
							
						}
						console.log({response});
					})
					.catch((error) => {
						this.$q.notify({
							message: error.response.data.error,
							type: "negative",
							position: "top-right",
						});
						console.log(error.response.data.error);
					});
			}
		},
		validateForm() {
			console.log(this.$refs.form.validate());

			/*  if (this.register) {
        if ( this.$refs.email.validate()
				&& this.$refs.account.validate()
				&& this.$refs.username.validate()
				&& this.$refs.password.validate()
				&& this.$refs.repassword.validate() ) { 
          this.validForm = true; 
        }
			} else {
				if ( this.$refs.email.validate() && this.$refs.password.validate() ) {
          this.validForm = true;
        }
			} */

			/* if (!this.register)
				if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
					this.$q.notify({
						icon: "done",
						color: "positive",
						message: "Logueado",
					});
				} */
		},
		switchTypeForm() {
			this.register = !this.register;
			this.title = this.register ? "Nueva cuenta" : "Login";
			this.btnLabel = this.register ? "Registro" : "Login";
		},
		switchVisibility() {
			this.visibility = !this.visibility;
			this.passwordFieldType = this.visibility ? "text" : "password";
			this.visibilityIcon = this.visibility ? "visibility_off" : "visibility";
		},
	},
};
</script>

<style></style>
