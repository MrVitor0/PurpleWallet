<template>
    <!-- ADD NEW INVESTMENT AREA --> 
    <div class="mt-1">
        <div class="flex p-2 md:pl-5 flex-wrap md:-mx-4">
            <!-- START OVERVIEW AREA -->
            <div class="w-full md:w-2/2 lg:w-1/3 mb-5 md:bg-purple-100 rounded-lg">
               <img src="@/assets/cardbg4.png" class="rounded- w-screen h-full  border-t border-gray-500 rounded-lg">
                <div class="relative flex flex-col flex-auto min-w-0 -mt-36 pt-12 md:pt-0 md:-mt-36 overflow-hidden break-words border-0  rounded-2xl bg-clip-border ">
                    <p class="pl-2 text-white text-5xl ">R$ {{ currentDebtsAmount }}</p>
                    <div class="flex">
                    <div class="flex flex-col">
                        <p class="pl-3 text-purple-200 text-2xl">{{ userName }}</p>
                    </div>
                    <div class="flex flex-col ml-auto">
                        <p class="pl-3 mr-2 md:mr-6 text-purple-200 text-2xl capitalize">{{ currentMonth }}/23</p>
                    </div>
                    </div>
                </div>
            </div>
            <!-- ACCOUNT BALANCE -->
            <div class="w-full md:w-1/2 lg:w-1/3 md:mb-5 mb-2 md:ml-10">
                <div class="flex justify-center items-center bg-white rounded-lg shadow p-4 h-full">
                    <div class="flex flex-col items-center text-center mt-26">
                        <div class="rounded-md bg-gradient-to-tr from-purple-900 to-purple-500 hover:from-purple-800 hover:to-purple-500 transition duration-500 ease-in-out shadow">
                        <font-awesome-icon icon="basket-shopping" class="text-white text-5xl p-6" />
                        </div>
                        <div class="text-md text-gray-700 font-medium mt-2">
                            Adicionar nova compra
                        </div>
                        <div class="text-xs font-light text-gray-500 mb-5 mt-1">
                            Uma nova compra foi realizada? <br/> Cadastre e mantenha os valores atualizados!
                        </div>
                        <div class="w-64">
                            <BasicButton  @click="showModal(1)" active="true" text="Adicionar Compra" icon="cart-plus" />
                        </div>  
                    </div>
                </div>
            </div>
        </div>
        <!-- RECENT TRANSACTIONS -->
        <div class="w-full md:pl-1 px-2 flex-wrap mb-2">
            <div class="bg-white rounded-lg shadow py-4 h-full">
                <div class="flex items-start justify-between text-center px-4 pb-4 md:p-3">
                    <div class="flex-start">
                        <p class="text-xl text-BBDark">Últimas Compras</p>
                    </div>
                    <div class="flex-end">
                        <font-awesome-icon title="View More" icon="fa-brands fa-pix" class="text-BBPurple text-2xl cursor-pointer pr-3" />
                    </div>
                </div>
                <hr class="h-px mx-3 bg-purple-200 border-0 mb-5" />
                <div class="md:max-w-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
                    <div class="max-h-[15rem] overflow-y-auto">
                        <!-- ITEM -->
                        <div v-if="transferItems.length >= 1" >
                            <div class="last-purchase-item" v-for="(item, index) in transferItems" :key="index">
                                <LastPurchase
                                    @onInteract="handleClick(item?.travelPurchase?.purchase_id)"
                                    :name="item.travelPurchase?.name"
                                    :method="item.method"
                                    :type="item.type"
                                    :id="item?.travelPurchase?.purchase_id"
                                    :date="formatDate(item.travelPurchase?.createdAt)"
                                    :value="formatCurrency(item.amount)"
                                    :total="formatCurrency(item.travelPurchase?.total_amount)"
                                />
                            </div>
                        </div>
                        <div v-else>
                            <p class="text-center text-BBDark">Nenhuma compra realizada</p>
                        </div>
                        <!-- ITEM -->
                    </div>
                </div>
            </div>
        </div>
       <!-- Modals-->
       <BBModal>
            <updateCurrentTravelValues  @updateDebtsAmount="updateDebtsAmount" v-if="this.currentModal == 1" />
        </BBModal>
     </div>
     <!-- PROFILE SETTINGS AREA -->
   </template>
   <script>
   import BasicButton from '@/components/button/BasicButton';
   import BBModal from '@/components/modal/BBModal.vue';
   import updateCurrentTravelValues from '@/components/modal/creditCards/updateCurrentTravelValues';
   import LastPurchase from '@/components/cards/common/LastPurchase.vue';
   import BBMoney from '@/utils/BBMoney';
   import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
   import PWUtils from '@/utils/PWUtils';
   export default {
     name: 'DashboardCredit',
     components: {
            BasicButton,
            LastPurchase,
            BBModal,
            updateCurrentTravelValues,
            FontAwesomeIcon,
      },
     data() {
       return {
         progress: 95,
         userName: 'N/A',
         debts_amount: 0,
         isModalVisible: true,
         currentModal: null,
         transferItems: [],
         debtsList: [],
       };
     },
     async mounted() {
        await this.fetchStatementData()
        await this.fetchDebtsTableData()
        await this.getUser()
     },
     methods: {
        async handleClick(id) {
            const response = await PWUtils.PWPopup('Aviso', 'Deseja realmente excluir essa compra?', 'warning', 'Sim', 'Não')
            if(response){
                this.$api.delete(`/api/travel/purchase/delete/${id}`).then((result) => {
                    console.log(result)
                    PWUtils.PWNotification('success', 'Compra excluída com sucesso!')
                    this.fetchStatementData()
                }).catch((err) => {
                    PWUtils.PWNotification('error', err.response.data.error)
                });
            }
            
        },
        formatDate(date){
            return PWUtils.formatDate(date)
        },
        formatCurrency(value){
            return "R$" + BBMoney.toCurrency(value)
        },
        updateDebtsAmount(){
            this.fetchStatementData()
        },
        getUser(){
            this.$store.dispatch('auth/fetchUserData').then((result) => {
                console.log(result)
                this.userName = result.name
            }).catch((err) => {
                throw new Error(err)
            });
        },
        async fetchDebtsTableData(){
            try {
                this.$api.get('/api/travel/purchase/retrieve/debts').then((result) => {
                   console.log(result)
                   this.debtsList = result.data.debts
                   
                }).catch((err) => {
                    throw new Error(err)
                });
            } catch (error) {
               PWUtils.PWNotification('error', error.message)
            }
        },
        async fetchStatementData(){
            try {
                this.$api.get('/api/travel/purchase/retrieve').then((result) => {
                   console.log(result)
                   this.debts_amount = result.data.total_debts
                   this.transferItems = result.data.purchases
                }).catch((err) => {
                    throw new Error(err)
                });
            } catch (error) {
               PWUtils.PWNotification('error', error.message)
            }
        },
        showModal(modalIndex) {
          this.currentModal = modalIndex;
          this.$store.dispatch('modal/showInputModal', true);
        },
     },
     computed: {
        currentDebtsAmount(){
            return BBMoney.toCurrency(this.debts_amount);
        },
        currentMonth() {
            const date = new Date();
            const month = date.toLocaleString('default', { month: 'long' });
            //get only first 3 letters
             return month.substring(0, 3);
        },
     },
   }
   </script>
 
 
 