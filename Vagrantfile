# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true


  config.vm.define "vm01" do |vm01|
    vm01.vm.box = "ubuntu/jammy64"
    vm01.vm.hostname = "steamscraper.io"
    vm01.vm.network "private_network", ip: "192.168.56.2"
    # vm01.vm.network "public_network", ip: '151.97.114.190', netmask: '255.255.248.0'
    vm01.vm.provider "virtualbox" do |vb| 
      vb.memory = "2048"
      vb.cpus = "4"
    end
    vm01.vm.provision "shell", path: "provision.sh"
  end

  # config.vm.define "lb01" do |lb01|
  #   lb01.vm.box = "ubuntu/jammy64"
  #   lb01.vm.hostname = "lb01"
  #   lb01.vm.network "private_network", ip: "192.168.56.2"
  #   lb01.vm.provider "virtualbox" do |vb| 
  #     vb.memory = "1024"
  #   end
  #   ss01.vm.provision "shell", path: "provision.sh"
  # end
  
  # config.vm.define "db01" do |db01|
  #   db01.vm.box = "ubuntu/jammy64"
  #   db01.vm.hostname = "db01"
  #   db01.vm.network "private_network", ip: "192.168.56.128"
  #   db01.vm.provider "virtualbox" do |vb| 
  #     vb.memory = "1024"
  #   end
  #   ss01.vm.provision "shell", path: "provision.sh"
  # end
  
  # config.vm.define "ss01" do |ss01|
  #   ss01.vm.box = "ubuntu/jammy64"
  #   ss01.vm.hostname = "ss01"
  #   ss01.vm.network "private_network", ip: "192.168.56.8"
  #   ss01.vm.provider "virtualbox" do |vb| 
  #     vb.memory = "2048"
  #     vb.cpus = "2"
  #   end
  #   ss01.vm.provision "shell", path: "provision.sh"
  # end

  # config.vm.define "ss02" do |ss02|
  #   ss02.vm.box = "eurolinux-vagrant/centos-stream-9"
  #   ss02.vm.hostname = "ss02"
  #   ss02.vm.network "private_network", ip: "192.168.56.9"
  #   ss02.vm.provider "virtualbox" do |vb| 
  #     vb.memory = "2048"
  #     vb.cpus = "2"
  #   end
  # end

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Disable the default share of the current code directory. Doing this
  # provides improved isolation between the vagrant box and your host
  # by making sure your Vagrantfile isn't accessible to the vagrant box.
  # If you use this you may want to enable additional shared subfolders as
  # shown above.
  # config.vm.synced_folder ".", "/vagrant", disabled: true

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Ansible, Chef, Docker, Puppet and Salt are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
end
